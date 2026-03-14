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
    public class ChatMessagesService : IService<ChatMessagesDto>
    {
        private readonly IRepository<ChatMessages> _repository;
        private readonly IMapper _mapper;

        public ChatMessagesService(IRepository<ChatMessages> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<ChatMessagesDto>> GetAll()
            => _mapper.Map<List<ChatMessagesDto>>(await _repository.GetAll());

        public async Task<ChatMessagesDto> GetById(int id)
            => _mapper.Map<ChatMessagesDto>(await _repository.GetById(id));

        public async Task<ChatMessagesDto> AddItem(ChatMessagesDto item)
        {
            item.Timestamp = DateTime.Now;
            var entity = _mapper.Map<ChatMessages>(item);
            var added = await _repository.AddItem(entity);
            return _mapper.Map<ChatMessagesDto>(added);
        }

        public async Task UpdateItem(int id, ChatMessagesDto item)
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

        public async Task<List<ChatMessagesDto>> GetMessagesByAssignment(int assignmentId)
        {
            var entities = (await _repository.GetAll())
                .Where(m => m.AssignmentID == assignmentId)
                .ToList();
            return _mapper.Map<List<ChatMessagesDto>>(entities);
        }
    }
}