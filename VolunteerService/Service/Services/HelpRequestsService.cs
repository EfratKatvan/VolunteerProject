using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Services
{
    public class HelpRequestsService : IService<HelpRequestsDto>
    {
        private readonly IRepository<HelpRequests> _repository;
        private readonly IMapper _mapper;

        public HelpRequestsService(IRepository<HelpRequests> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
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