using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Services
{
    public class CategoriesService : IService<CategoriesDto>
    {
        private readonly IRepository<Categories> _repository;
        private readonly IMapper _mapper;

        public CategoriesService(IRepository<Categories> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<CategoriesDto>> GetAll()
            => _mapper.Map<List<CategoriesDto>>(await _repository.GetAll());

        public async Task<CategoriesDto> GetById(int id)
            => _mapper.Map<CategoriesDto>(await _repository.GetById(id));

        public async Task<CategoriesDto> AddItem(CategoriesDto item)
        {
            var entity = _mapper.Map<Categories>(item);
            var added = await _repository.AddItem(entity);
            return _mapper.Map<CategoriesDto>(added);
        }

        public async Task UpdateItem(int id, CategoriesDto item)
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

        public async Task<List<CategoriesDto>> SearchByNameOrDescription(string search)
        {
            var entities = await _repository.Find(search);
            return _mapper.Map<List<CategoriesDto>>(entities);
        }
    }
}