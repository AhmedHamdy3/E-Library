using AutoMapper;
using E_Library.DTOS.Book;
using E_Library.Models;
using E_Library.UOW;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<BookController> _logger;
        public BookController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<BookController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }
        
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<BookReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<BookReadDTO>>> GetBooks()
        {
            try
            {
                var books = await _unitOfWork.BookRepository.GetAllAsync();
                if (books == null || !books.Any())
                {
                    _logger.LogWarning("No books found");
                    return NotFound("No books found");
                }
                IEnumerable<BookReadDTO> booksReadDTO = _mapper.Map<IEnumerable<BookReadDTO>>(books);
                return Ok(booksReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all books");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [HttpGet("/api/bookPage")]
        [ProducesResponseType(typeof(IEnumerable<BookReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<BookReadDTO>>> GetBooks(int page = 1, int pageSize = 10, string filter="")
        {
            try
            {
                var (books, totalCount) = await _unitOfWork.BookRepository.GetPageAsync(page, pageSize, filter);
                if (books == null || !books.Any())
                {
                    _logger.LogWarning("No books found");
                    return NoContent();
                }
                IEnumerable<BookReadDTO> booksReadDTO = _mapper.Map<IEnumerable<BookReadDTO>>(books);

                Response.Headers.Add("X-Total-Count", totalCount.ToString());
                Response.Headers.Add("X-Page-Number", page.ToString());
                Response.Headers.Add("X-Page-Size", pageSize.ToString());
                return Ok(booksReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all books");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("userPage/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<BookReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<BookReadDTO>>> GetBooksForUser(string userId, int page = 1, int pageSize = 10, string filter = "")
        {
            try
            {
                var (books, totalCount) = await _unitOfWork.BookRepository.GetPageForSpecificUserAsync(userId, page, pageSize, filter);
                if (books == null || !books.Any())
                {
                    _logger.LogWarning("No books found");
                    return NoContent();
                }
                IEnumerable<BookReadDTO> booksReadDTO = _mapper.Map<IEnumerable<BookReadDTO>>(books);

                Response.Headers.Add("X-Total-Count", totalCount.ToString());
                Response.Headers.Add("X-Page-Number", page.ToString());
                Response.Headers.Add("X-Page-Size", pageSize.ToString());
                return Ok(booksReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all books");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<BookReadDTO>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<BookReadDTO>>> GetBooksForUser(string userId)
        {
            try
            {
                var books= await _unitOfWork.BookRepository.GetPageForSpecificUserAsync(userId);
                if (books == null || !books.Any())
                {
                    _logger.LogWarning("No books found");
                    return NoContent();
                }
                IEnumerable<BookReadDTO> booksReadDTO = _mapper.Map<IEnumerable<BookReadDTO>>(books);

                return Ok(booksReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all books");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BookReadDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookReadDTO>> GetBook(int id)
        {
            try
            {
                Book book = await _unitOfWork.BookRepository.GetByIdAsync(id);
                if (book == null)
                {
                    _logger.LogWarning("Book with id {Id} not found", id);
                    return NotFound();
                }
                BookReadDTO bookReadDTO = _mapper.Map<BookReadDTO>(book);
                return Ok(bookReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting book with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ProducesResponseType(typeof(BookReadDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddBook(BookCreateDTO bookCreateDTO)
        {
            try
            {
                if (bookCreateDTO == null)
                {
                    _logger.LogWarning("Book creation data is null");
                    return BadRequest("Invalid Book Data");
                }
                if (!ModelState.IsValid)
                {
                    _logger.LogError("Invalid book data");
                    return BadRequest(ModelState);
                }
                Book book = _mapper.Map<Book>(bookCreateDTO);
                await _unitOfWork.BookRepository.AddAsync(book);
                await _unitOfWork.Save();

                Book Addedbook = await _unitOfWork.BookRepository.GetByIdAsync(book.Id); 
                BookReadDTO bookReadDTO = _mapper.Map<BookReadDTO>(Addedbook);

                return CreatedAtAction(nameof(GetBook), new { id = Addedbook.Id }, bookReadDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateBook(int id, BookUpdateDTO bookUpdateDTO)
        {
            try
            {
                if (bookUpdateDTO == null)
                {
                    _logger.LogWarning("Invalid book update data for id {Id}", id);
                    return NotFound();
                }
                if (bookUpdateDTO.Id != id)
                {
                    _logger.LogWarning("Invalid book update data");
                    return BadRequest("Invalid book Data");
                }

                Book existingBook = await _unitOfWork.BookRepository.GetByIdAsync(id);
                _mapper.Map(bookUpdateDTO, existingBook);
                await _unitOfWork.BookRepository.UpdateAsync(existingBook);
                await _unitOfWork.Save();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteBook(int id)
        {
            try
            {
                var book = await _unitOfWork.BookRepository.GetByIdAsync(id);
                if (book == null)
                {
                    _logger.LogWarning("Book with id {Id} not found for deletion", id);
                    return NotFound($"Book with id {id} not found");
                }

                if (!await _unitOfWork.BookRepository.ExistsAsync(id))
                {
                    return NotFound();
                }
                await _unitOfWork.BookRepository.DeleteAsync(id);
                await _unitOfWork.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book with id {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }
    }
}
