using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Services
{
    public class HelpRequestsService : IService<HelpRequestsDto>
    {
        private readonly IRepository<HelpRequests> _repository;
        private readonly IMapper _mapper;
        private readonly AIService _aiService;
        private readonly IRepository<Categories> _categoryRepository;

        public HelpRequestsService(
            IRepository<HelpRequests> repository,
            IMapper mapper,
            IRepository<Categories> categoryRepository
        )
        {
            _repository = repository;
            _mapper = mapper;
            _aiService = new AIService();
            _categoryRepository = categoryRepository;
        }

        public async Task<List<HelpRequestsDto>> GetAll()
            => _mapper.Map<List<HelpRequestsDto>>(await _repository.GetAll());

        public async Task<HelpRequestsDto> GetById(int id)
            => _mapper.Map<HelpRequestsDto>(await _repository.GetById(id));

        public async Task<HelpRequestsDto> AddItem(HelpRequestsDto item)
        {
            item.CreatedAt = DateTime.Now;
            var entity = _mapper.Map<HelpRequests>(item);
            var added = await _repository.AddItem(entity);
            return _mapper.Map<HelpRequestsDto>(added);
        }

        // פונקציה שמשלבת AI ושומרת קטגוריה בלבד, בלי לשנות DTO/Entities
        public async Task<HelpRequestsDto> AddHelpRequestWithAI(HelpRequestsDto item)
        {
            item.CreatedAt = DateTime.Now;

            // 1. קבלת קטגוריה חכמה מה-AI
            var aiResult = await _aiService.GetCategoryFromAI(item.Description);

            var categoryName = aiResult.category;
            var icon = aiResult.icon;
            var status = aiResult.status;
            // 2. מציאת קטגוריה קיימת או יצירת חדשה
            Categories existingCategory = null;
            var categories = await _categoryRepository.GetAll();
            existingCategory = categories.FirstOrDefault(c => c.Name == categoryName);

            var safeCategoryName = string.IsNullOrWhiteSpace(categoryName) ? "Uncategorized" : categoryName;

            if (existingCategory == null)
            {
                existingCategory = new Categories
                {
                    Name = categoryName,
                    Description = categoryName,
                    Icon = icon
                };
                await _categoryRepository.AddItem(existingCategory);
            }

            // 3. שמירת הבקשה עם הקטגוריה
            var entity = _mapper.Map<HelpRequests>(item);
            entity.CategoryID = existingCategory.Id;

            var added = await _repository.AddItem(entity);

            // 4. מחזירים DTO רגיל, אפשר להחזיר גם שם קטגוריה ב‑Description אם רוצים
            var dto = _mapper.Map<HelpRequestsDto>(added);
            return dto;
        }

        public async Task UpdateItem(int id, HelpRequestsDto item)
        {
            var existing = await _repository.GetById(id);
            if (existing != null)
            {
                _mapper.Map(item, existing);
                await _repository.UpdateItem(id, existing);
            }
        }

        public async Task DeleteItem(int id)
            => await _repository.DeleteItem(id);

        public async Task<List<HelpRequestsDto>> GetHelpRequestsByStatus(HelpRequestStatus status)
        {
            var entities = await _repository.Find(status.ToString());
            return _mapper.Map<List<HelpRequestsDto>>(entities);
        }
    }
}



