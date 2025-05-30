﻿using E_Library.Models;
using E_Library.Repositories.Implementaions;
using E_Library.Repositories.Interfaces;

namespace E_Library.UOW
{
    public class UnitOfWork : IUnitOfWork
    {
        ELibraryContext _context;
        public IBookRepository bookRepository;
        public IUserRepository userRepository;
        public ICategoryRepository categoryRepository;
        public UnitOfWork(ELibraryContext context) {
            _context = context;
        }
        public IBookRepository BookRepository
        {
            get
            {
                if (bookRepository == null)
                {
                    bookRepository = new BookRepository(_context);
                }
                return bookRepository;
            }
        }

        public ICategoryRepository CategoryRepository
        {
            get
            {
                if(categoryRepository == null)
                {
                    categoryRepository = new CategoryRepository(_context);
                }
                return categoryRepository;
            }
        }

        public IUserRepository UserRepository
        {
            get
            {
                if(userRepository == null)
                {
                    userRepository = new UserRepository(_context);
                }
                return userRepository;
            }
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
