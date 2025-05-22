using AutoMapper;
using E_Library.DTOS.Category;
using E_Library.Models;
using E_Library.UOW;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace E_Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class CategoryController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<CategoryController> _logger;
        public CategoryController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<CategoryController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoryReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CategoryReadDTO>>> GetCategories()
        {
            try
            {
                var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
                if (categories == null || !categories.Any())
                {
                    _logger.LogWarning("No Categories found");
                    return NotFound("No categories found");
                }
                IEnumerable<CategoryReadDTO> categoriesReadDTO = _mapper.Map<IEnumerable<CategoryReadDTO>>(categories);
                return Ok(categoriesReadDTO);
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Error getting all categories");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");            
            }
        }

        [HttpGet("/api/categoryPage")]
        [ProducesResponseType(typeof(IEnumerable<CategoryReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CategoryReadDTO>>> GetCategories(int page = 1, int pageSize = 10)
        {
            try
            {
                var (categories, totalCount) = await _unitOfWork.CategoryRepository.GetPageAsync(page, pageSize);
                if (categories == null || !categories.Any())
                {
                    _logger.LogWarning("No Categories found");
                    return NotFound("No categories found");
                }
                IEnumerable<CategoryReadDTO> categoriesReadDTO = _mapper.Map<IEnumerable<CategoryReadDTO>>(categories);
             
                Response.Headers.Add("X-Total-Count", totalCount.ToString());
                Response.Headers.Add("X-Page-Number", page.ToString());
                Response.Headers.Add("X-Page-Size", pageSize.ToString());
                
                return Ok(categoriesReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all categories");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CategoryReadDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoryReadDTO>> GetCategory(int id)
        {
            try
            {
                Category category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
                if (category == null) {
                    _logger.LogWarning("Category with id {Id} not found", id);
                    return NotFound();
                }
                CategoryReadDTO categoryReadDTO = _mapper.Map<CategoryReadDTO>(category);
                return Ok(categoryReadDTO);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error getting category with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(CategoryReadDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddCategory(CategoryCreateDTO categoryCreateDTO)
        {
            try
            {
                if (categoryCreateDTO == null) {
                    _logger.LogWarning("Category creation data is null");
                    return BadRequest("Invalid Category Data");
                }
                if (!ModelState.IsValid)
                {
                    _logger.LogError("Invalid category data");
                    return BadRequest(ModelState);
                }
                Category category = _mapper.Map<Category>(categoryCreateDTO);
                await _unitOfWork.CategoryRepository.AddAsync(category);
                await _unitOfWork.Save();

                CategoryReadDTO categoryReadDTO = _mapper.Map<CategoryReadDTO>(category);

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryReadDTO);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateCategory(int id, CategoryUpdateDTO categoryUpdateDTO)
        {
            try
            {
                if(categoryUpdateDTO == null)
                {
                    _logger.LogWarning("Invalid category update data for id {Id}", id);
                    return NotFound();
                }
                if(categoryUpdateDTO.Id != id)
                {
                    _logger.LogWarning("Invalid category update data");
                    return BadRequest("Invalid Category Data");
                }

                Category existingCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
                _mapper.Map(categoryUpdateDTO, existingCategory);
                await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory);
                await _unitOfWork.Save();

                return NoContent();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error updating category with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
                if (category == null)
                {
                    _logger.LogWarning("Category with id {Id} not found for deletion", id);
                    return NotFound($"Category with id {id} not found");
                }

                // Check if category has books before deletion
                if (category.Books != null && category.Books.Any())
                {
                    _logger.LogWarning("Cannot delete category with id {Id} because it contains books", id);
                    return BadRequest("Cannot delete category because it contains books");
                }

                if (!await _unitOfWork.CategoryRepository.ExistsAsync(id))
                {
                    return NotFound();
                }
                await _unitOfWork.CategoryRepository.DeleteAsync(id);
                await _unitOfWork.Save();
                return NoContent();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error deleting category with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }
    }
}
