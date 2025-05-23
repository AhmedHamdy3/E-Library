using AutoMapper;
using E_Library.DTOS.User;
using E_Library.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace E_Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        public AccountController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, 
            IMapper mapper, IConfiguration config) {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _config = config;
        }
        [HttpPost("Register")]
        public async Task<ActionResult> Register(UserCreateDTO userCreateDTO)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            User existingUser = await _userManager.FindByEmailAsync(userCreateDTO.Email);

            if (existingUser != null) {
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

            if(!await _roleManager.RoleExistsAsync(userCreateDTO.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole(userCreateDTO.Role));
            }
            await _userManager.AddToRoleAsync(user, userCreateDTO.Role);

            return Ok("Account Created Successfully");
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(UserLoginDTO userLoginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(userLoginDTO.Email);
            if (user == null)
                return Unauthorized("Invalid Credentials");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, userLoginDTO.Password);
            if (!isPasswordValid)
                return Unauthorized("Invalid Credentials");

            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Iss"],
                audience: _config["JWT:Aud"],
                expires: DateTime.Now.AddHours(2),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                username = user.Name,
                roles = userRoles,
                id = user.Id
            });
        }
    }
}
    