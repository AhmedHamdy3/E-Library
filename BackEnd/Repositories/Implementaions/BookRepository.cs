using E_Library.Models;
using E_Library.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Library.Repositories.Implementaions
{
    public class BookRepository : GenericRepository<Book, int>, IBookRepository
    {
        private readonly ELibraryContext _context;

        public BookRepository(ELibraryContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> BuyBookAsync(int bookId, string userId)
        {
            if (bookId <= 0) throw new ArgumentException("Invalid book ID", nameof(bookId));
            if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("User ID cannot be empty", nameof(userId));

            bool alreadyOwns = await _context.UserBooks
                .AnyAsync(ub => ub.UserId == userId && ub.BookId == bookId);

            if (alreadyOwns)
            {
                return false; 
            }

            var userBook = new UserBook
            {
                UserId = userId,
                BookId = bookId,
            };
            await _context.UserBooks.AddAsync(userBook);
            return true;
        }

        public async Task<Tuple<IEnumerable<Book>, int>> GetPageAsync(int page, int pageSize, string filter)
        {
            IQueryable<Book> query = _context.Books;
            
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(b => b.Title.Contains(filter));
            }

            var totalCount = await query.CountAsync();

            var entites = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new Tuple<IEnumerable<Book>, int> (entites, totalCount);
        }

        public async Task<Tuple<IEnumerable<Book>, int>> GetPageForSpecificUserAsync(string userId,int page, int pageSize, string filter)
        {
            IQueryable<Book> query = _context.UserBooks
                                        .Where(ub => ub.UserId == userId)
                                        .Select(ub => ub.Book);
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(b => b.Title.Contains(filter));
            }

            var totalCount = await query.CountAsync();

            var entites = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new Tuple<IEnumerable<Book>, int>(entites, totalCount);
        }

        public async Task<IEnumerable<Book>> GetPageForSpecificUserAsync(string userId)
        {
            return await _context.UserBooks.Where(ub => ub.UserId == userId).Select(ub => ub.Book).ToListAsync();
        }
    }
}
