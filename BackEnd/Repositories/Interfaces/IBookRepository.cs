using E_Library.Models;

namespace E_Library.Repositories.Interfaces
{
    public interface IBookRepository : IGenericRepository<Book, int>
    {
        public Task<Tuple<IEnumerable<Book>, int>> GetPageAsync(int page, int pageSize, string filter);
    }
}
