using E_Library.Models;
using E_Library.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Library.Repositories.Implementaions
{
    public class CategoryRepository : GenericRepository<Category, int>, ICategoryRepository
    {
        private readonly ELibraryContext _context;

        public CategoryRepository(ELibraryContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Tuple<IEnumerable<Category>, int>> GetPageAsync(int page, int pageSize, string filter)
        {
            IQueryable<Category> query = _context.Categories;

            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(b => b.Name.Contains(filter));
            }

            var totalCount = await query.CountAsync();

            var entites = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new Tuple<IEnumerable<Category>, int>(entites, totalCount);
        }
    }
}
