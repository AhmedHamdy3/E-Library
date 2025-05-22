using E_Library.Models;
using E_Library.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Library.Repositories.Implementaions
{
    public class UserRepository : GenericRepository<User, string>, IUserRepository
    {
        private readonly ELibraryContext _context;

        public UserRepository(ELibraryContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Tuple<IEnumerable<User>, int>> GetPageAsync(int page, int pageSize, string filter)
        {
            IQueryable<User> users = _context.Users;
            if (!string.IsNullOrEmpty(filter))
            {
                users = users.Where(u => u.Name.Contains(filter));
            }
            var totalCount = await users.CountAsync();
            
            var entites = await users.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            
            return new Tuple<IEnumerable<User>, int>(entites, totalCount);
        }
    }
}
