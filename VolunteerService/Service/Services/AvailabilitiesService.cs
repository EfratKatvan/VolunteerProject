using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Services
{
    public class AvailabilitiesService : IService<AvailabilitiesDto>
    {
        private readonly IRepository<Availabilities> _repository;
        private readonly IMapper _mapper;

        public AvailabilitiesService(IRepository<Availabilities> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<AvailabilitiesDto>> GetAll()
            => _mapper.Map<List<AvailabilitiesDto>>(await _repository.GetAll());

        public async Task<AvailabilitiesDto> GetById(int id)
            => _mapper.Map<AvailabilitiesDto>(await _repository.GetById(id));

        public async Task<AvailabilitiesDto> AddItem(AvailabilitiesDto item)
        {
            var entity = _mapper.Map<Availabilities>(item);
            var added = await _repository.AddItem(entity);
            return _mapper.Map<AvailabilitiesDto>(added);
        }

        public async Task UpdateItem(int id, AvailabilitiesDto item)
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

        public async Task<List<AvailabilitiesDto>> GetAvailabilitiesByDay(DAY day)
        {
            var entities = (await _repository.GetAll())
                .Where(a => a.Day == day)
                .ToList();
            return _mapper.Map<List<AvailabilitiesDto>>(entities);
        }

        public async Task<List<AvailabilitiesDto>> GetAvailabilitiesByUserId(int userId)
        {
            var entities = (await _repository.GetAll())
                .Where(a => a.UserID == userId)
                .ToList();

            return _mapper.Map<List<AvailabilitiesDto>>(entities);
        }

    }
}