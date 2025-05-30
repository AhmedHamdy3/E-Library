﻿using E_Library.Models;
using E_Library.Repositories.Interfaces;

namespace E_Library.UOW
{
    public interface IUnitOfWork
    {
        public IBookRepository BookRepository{ get; }
        public IUserRepository UserRepository { get; }
        public ICategoryRepository CategoryRepository { get; }
        Task Save();
    }
}
