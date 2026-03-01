using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Repository.Entities;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories
{
    public class HelpRequestsRepository : IRepository<HelpRequests>
    {
        private readonly IContext _context;

        public HelpRequestsRepository(IContext context)
        {
            _context = context;
        }

        public async Task<HelpRequests> AddItem(HelpRequests item)
        {
            _context.HelpRequests.Add(item);
            await _context.SaveAsync();
            return item;
        }

        public async Task DeleteItem(int id)
        {
            var item = await GetById(id);
            if (item != null)
            {
                _context.HelpRequests.Remove(item);
                await _context.SaveAsync();
            }
        }

        public async Task<List<HelpRequests>> GetAll()
        {
            return await _context.HelpRequests.ToListAsync();
        }

        public async Task<HelpRequests> GetById(int id)
        {
            return await _context.HelpRequests.FirstOrDefaultAsync(hr => hr.Id == id);
        }

        public async Task UpdateItem(int id, HelpRequests item)
        {
            var existing = await GetById(id);
            if (existing != null)
            {
                existing.NeedyID = item.NeedyID;
                existing.CategoryID = item.CategoryID;
                existing.Description = item.Description;
                existing.Status = item.Status;
                existing.CreatedAt = item.CreatedAt;
                existing.Latitude = item.Latitude;
                existing.Longitude = item.Longitude;
                await _context.SaveAsync();
            }
        }

        public async Task<List<HelpRequests>> Find(string whereClause)
        {
            return await _context.HelpRequests
                .Where(hr => hr.Description.Contains(whereClause))
                .ToListAsync();
        }
    }
}
