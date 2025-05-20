using E_Library.Models;
using E_Library.Repositories.Interfaces;

namespace E_Library.Repositories.Implementaions
{
    public class BookRepository : GenericRepository<Book, int>, IBookRepository
    {
        public BookRepository(ELibraryContext context) : base(context) { }
    }
}
