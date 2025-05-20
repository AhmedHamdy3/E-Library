using E_Library.Models;
using E_Library.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Library.Repositories.Implementaions
{
    public class GenericRepository<TEntity, Tkey> : IGenericRepository<TEntity, Tkey> where TEntity : class
    {
        protected readonly ELibraryContext _context;
        protected readonly DbSet<TEntity> _dbSet;
        
        public GenericRepository(ELibraryContext context) {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public async Task AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task DeleteAsync(Tkey id)
        {
            TEntity entity = await GetByIdAsync(id);
            _dbSet.Remove(entity);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<TEntity> GetByIdAsync(Tkey id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task UpdateAsync(TEntity entity)
        {
            _dbSet.Update(entity);
        }
    }
}
