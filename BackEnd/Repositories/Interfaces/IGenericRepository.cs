﻿namespace E_Library.Repositories.Interfaces
{
    public interface IGenericRepository<TEntity, TKey> where TEntity : class
    {
        Task<TEntity> GetByIdAsync(TKey id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        
        public Task<Tuple<IEnumerable<TEntity>, int>> GetPageAsync(int page, int pageSize);
        Task AddAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task DeleteAsync(TKey id);
        Task<bool> ExistsAsync(TKey id); 
    }
}
