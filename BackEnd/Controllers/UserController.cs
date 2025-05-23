using AutoMapper;
using E_Library.DTOS.Book;
using E_Library.DTOS.Category;
using E_Library.DTOS.User;
using E_Library.Models;
using E_Library.Repositories.Interfaces;
using E_Library.UOW;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace E_Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        ILogger<UserController> _logger;
        public UserController(IUnitOfWork unitOfWork, UserManager<User> userManager, 
            RoleManager<IdentityRole> roleManager, IMapper mapper, ILogger<UserController> logger)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsers()
        {
            try
            {
                var users = await _unitOfWork.UserRepository.GetAllAsync();
                if (users == null || !users.Any())
                {
                    _logger.LogWarning("No users found");
                    return NotFound("No users found");
                }
                List<UserReadDTO> usersReadDTO = new List<UserReadDTO>();
                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    UserReadDTO userReadDTO = new UserReadDTO
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = roles.FirstOrDefault().ToString()
                    };
                    usersReadDTO.Add(userReadDTO);
                }
                return Ok(usersReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("/api/userPage")]
        [ProducesResponseType(typeof(IEnumerable<UserReadDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsers(int page = 1, int pageSize = 10, string filter = "")
        {
            try
            {
                var (users, totalCount) = await _unitOfWork.UserRepository.GetPageAsync(page, pageSize, filter);
                if (users == null || !users.Any())
                {
                    _logger.LogWarning("No users found");
                    return NoContent();
                }
                List<UserReadDTO> usersReadDTO = new List<UserReadDTO>();
                foreach (var user in users) { 
                    var roles = await _userManager.GetRolesAsync(user);
                    UserReadDTO userReadDTO = new UserReadDTO
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = roles.FirstOrDefault().ToString()
                    };
                    usersReadDTO.Add(userReadDTO);
                }
                
                Response.Headers.Add("X-Total-Count", totalCount.ToString());
                Response.Headers.Add("X-Page-Number", page.ToString());
                Response.Headers.Add("X-Page-Size", pageSize.ToString());

                return Ok(usersReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserReadDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserReadDTO>> GetUser(string id)
        {
            try
            {
                User user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("User with id {Id} not found", id);
                    return NotFound();
                }
                var roles = await _userManager.GetRolesAsync(user);
                UserReadDTO userReadDTO = new UserReadDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = roles.FirstOrDefault().ToString()
                };
                return Ok(userReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(UserReadDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddUser(UserCreateDTO userCreateDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                User existingUser = await _userManager.FindByEmailAsync(userCreateDTO.Email);

                if (existingUser != null)
                {
                    return BadRequest("Email already Exists");
                }

                User user = _mapper.Map<User>(userCreateDTO);

                var result = await _userManager.CreateAsync(user, userCreateDTO.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                    return BadRequest(ModelState);
                }

                if (!await _roleManager.RoleExistsAsync(userCreateDTO.Role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(userCreateDTO.Role));
                }
                await _userManager.AddToRoleAsync(user, userCreateDTO.Role);

                UserReadDTO userReadDTO = _mapper.Map<UserReadDTO>(user);
                return CreatedAtAction(nameof(GetUser), new {id = user.Id}, userReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateUser(string id, UserUpdateDTO userUpdateDTO)
        {
            try
            {
                if (userUpdateDTO == null)
                {
                    _logger.LogWarning("Invalid user update data for id {Id}", id);
                    return NotFound();
                }
                if (userUpdateDTO.Id != id)
                {
                    _logger.LogWarning("Invalid user update data");
                    return BadRequest("Invalid user Data");
                }

                User existingUser = await _userManager.FindByIdAsync(id);
                if (existingUser == null)
                {
                    _logger.LogWarning("User not found for update: {UserId}", id);
                    return NotFound();
                }

                _mapper.Map(userUpdateDTO, existingUser);
                var updateResult = await _userManager.UpdateAsync(existingUser);

                if (!updateResult.Succeeded)
                {
                    foreach (var error in updateResult.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    return BadRequest(ModelState);
                }

                await UpdateUserRole(existingUser, userUpdateDTO.Role);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        private async Task UpdateUserRole(User user, string newRole)
        {
            var currentRoles = await _userManager.GetRolesAsync(user);

            if(currentRoles.FirstOrDefault() != newRole)
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                await _userManager.AddToRoleAsync(user, newRole);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteUser(string id)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("User with id {Id} not found for deletion", id);
                    return NotFound($"User with id {id} not found");
                }

                if (!await _unitOfWork.UserRepository.ExistsAsync(id))
                {
                    return NotFound();
                }
                await _unitOfWork.UserRepository.DeleteAsync(id);
                await _unitOfWork.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }


        [Authorize(Roles = "User")]
        [HttpGet("buy")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> buy(string userId, int bookId)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.ExistsAsync(userId);
                if (user == false)
                {
                    _logger.LogWarning("User with id {Id} not found", userId);
                    return NotFound($"User with id {userId} not found");
                }
                var book = await _unitOfWork.BookRepository.ExistsAsync(bookId);
                if (book == false)
                {
                    _logger.LogWarning("book with id {Id} not found", bookId);
                    return NotFound($"book with id {bookId} not found");
                }

                bool isSuccess = await _unitOfWork.BookRepository.BuyBookAsync(bookId, userId);
                if (!isSuccess)
                {
                    return BadRequest();
                }

                await _unitOfWork.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error buying book with id {Id}", bookId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }
    }
}
