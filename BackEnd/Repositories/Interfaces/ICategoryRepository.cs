using E_Library.Models;

namespace E_Library.Repositories.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category, int>
    {
        public Task<Tuple<IEnumerable<Category>, int>> GetPageAsync(int page, int pageSize, string filter);
    }
}
