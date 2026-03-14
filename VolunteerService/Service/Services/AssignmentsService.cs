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
    public class AssignmentsService : IService<AssignmentsDto>
    {
        private readonly IRepository<Assignments> _repository;
        private readonly IMapper _mapper;

        public AssignmentsService(IRepository<Assignments> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<AssignmentsDto>> GetAll()
            => _mapper.Map<List<AssignmentsDto>>(await _repository.GetAll());

        public async Task<AssignmentsDto> GetById(int id)
            => _mapper.Map<AssignmentsDto>(await _repository.GetById(id));

        public async Task<AssignmentsDto> AddItem(AssignmentsDto item)
        {
            var entity = _mapper.Map<Assignments>(item);
            entity.AssignedAt = DateTime.Now;
            entity.Status = AssignmentStatus.Active;
            var added = await _repository.AddItem(entity);
            return _mapper.Map<AssignmentsDto>(added);
        }

        public async Task UpdateItem(int id, AssignmentsDto item)
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

        public async Task<List<AssignmentsDto>> GetAssignmentsByVolunteer(int volunteerId)
        {
            var entities = (await _repository.GetAll())
                .Where(a => a.VolunteerID == volunteerId)
                .ToList();
            return _mapper.Map<List<AssignmentsDto>>(entities);
        }

        public async Task<List<AssignmentsDto>> GetAssignmentsByStatus(AssignmentStatus status)
        {
            var entities = await _repository.Find(status.ToString());
            return _mapper.Map<List<AssignmentsDto>>(entities);
        }

        public async Task CompleteAssignment(int id)
        {
            var entity = await _repository.GetById(id);
            if (entity != null)
            {
                entity.Status = AssignmentStatus.Finished;
                await _repository.UpdateItem(id, entity);
            }
        }

        public async Task CancelAssignment(int id)
        {
            var entity = await _repository.GetById(id);
            if (entity != null)
            {
                entity.Status = AssignmentStatus.Cancelled;
                await _repository.UpdateItem(id, entity);
            }
        }
        public async Task<int> GetHelpedCountByVolunteer(int volunteerId)
        {
            var allAssignments = await _repository.GetAll();

            // סופרים רק את המשימות שהסטטוס שלהן Finished
            var finishedCount = allAssignments
                                .Where(a => a.VolunteerID == volunteerId && a.Status == AssignmentStatus.Finished)
                                .Count();

            return finishedCount;
        }
    }
}