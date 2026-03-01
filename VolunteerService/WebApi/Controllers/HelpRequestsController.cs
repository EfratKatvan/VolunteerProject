using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HelpRequestsController : ControllerBase
    {
        private readonly IService<HelpRequestsDto> _service;

        public HelpRequestsController(IService<HelpRequestsDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<List<HelpRequestsDto>> Get()
        {
            return await _service.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<HelpRequestsDto> Get(int id)
        {
            return await _service.GetById(id);
        }

        [HttpPost]
        public async Task<HelpRequestsDto> Post([FromBody] HelpRequestsDto value)
        {
            return await _service.AddItem(value);
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] HelpRequestsDto value)
        {
            await _service.UpdateItem(id, value);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _service.DeleteItem(id);
        }
    }
}