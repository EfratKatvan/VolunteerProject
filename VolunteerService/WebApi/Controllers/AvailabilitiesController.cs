using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Entities;
using Repository.Interfaces;
using Service.Dto;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AvailabilitiesController : ControllerBase
    {
        private readonly IRepository<Availabilities> _availabilityRepository;
        private readonly IRepository<UserAvailabilities> _userAvailabilityRepository;
        private readonly IMapper _mapper;

        public AvailabilitiesController(
            IRepository<Availabilities> availabilityRepository,
            IRepository<UserAvailabilities> userAvailabilityRepository,
            IMapper mapper)
        {
            _availabilityRepository = availabilityRepository;
            _userAvailabilityRepository = userAvailabilityRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<List<AvailabilitiesDto>> Get()
        {
            var all = await _availabilityRepository.GetAll();
            return _mapper.Map<List<AvailabilitiesDto>>(all);
        }

        [HttpGet("{id}")]
        public async Task<AvailabilitiesDto> Get(int id)
        {
            var avail = await _availabilityRepository.GetById(id);
            return _mapper.Map<AvailabilitiesDto>(avail);
        }

        
        [HttpPost]
        public async Task<AvailabilitiesDto> Post([FromBody] AvailabilitiesDto value)
        {
            // יוצרים זמינות חדשה
            var availability = _mapper.Map<Availabilities>(value);
            var addedAvailability = await _availabilityRepository.AddItem(availability);

            // יוצרים קשר עם המשתמש
            var userAvailability = new UserAvailabilities
            {
                UserID = value.UserID,
                AvailabilityID = addedAvailability.Id
            };
            await _userAvailabilityRepository.AddItem(userAvailability);

            return _mapper.Map<AvailabilitiesDto>(addedAvailability);
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] AvailabilitiesDto value)
        {
            var avail = _mapper.Map<Availabilities>(value);
            await _availabilityRepository.UpdateItem(id, avail);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _availabilityRepository.DeleteItem(id);
        }
    }
}