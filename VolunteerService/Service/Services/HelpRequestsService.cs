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

        public async Task<HelpRequestsDto> AddHelpRequestWithAI(HelpRequestsDto item)
        {
            item.CreatedAt = DateTime.Now;

            // 1. קבלת קטגוריה מה-AI
            var aiResult = await _aiService.GetCategoryFromAI(item.Description);
            var categoryName = aiResult.category;
            var icon = aiResult.icon;

            // 2. מציאת/יצירת קטגוריה
            var categories = await _categoryRepository.GetAll();
            var existingCategory = categories.FirstOrDefault(c => c.Name == categoryName);

            if (existingCategory == null)
            {
                existingCategory = new Categories
                {
                    Name = string.IsNullOrWhiteSpace(categoryName) ? "Uncategorized" : categoryName,
                    Description = categoryName,
                    Icon = icon
                };
                await _categoryRepository.AddItem(existingCategory);
            }

            // 3. המרת ה-DTO ל-entity כולל Availability
            var entity = _mapper.Map<HelpRequests>(item);
            entity.CategoryID = existingCategory.Id;

            // 4. וידוא שה-Availability מועבר נכון מה-DTO
            if (item.Availability != null && entity.Availability == null)
            {
                entity.Availability = new Availabilities
                {
                    UserID = item.Availability.UserID,
                    Day = item.Availability.Day,
                    From_Time = item.Availability.From_Time,
                    To_Time = item.Availability.To_Time
                };
            }

            // 5. שמירה (ה-Repository שומר Availability קודם)
            var added = await _repository.AddItem(entity);

            return _mapper.Map<HelpRequestsDto>(added);
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
