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
    }
}
