using E_Library.Models;

namespace E_Library.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User, string>
    {
        public Task<Tuple<IEnumerable<User>, int>> GetPageAsync(int page, int pageSize, string filter);

    }
}
