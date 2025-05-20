using E_Library.Models;
using E_Library.Repositories.Interfaces;

namespace E_Library.Repositories.Implementaions
{
    public class UserRepository: GenericRepository<User, string>, IUserRepository
    {
        public UserRepository(ELibraryContext context) : base(context) { }
    }
}
