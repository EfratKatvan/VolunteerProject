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
    public class AssignmentsController : ControllerBase
    {
        private readonly IService<AssignmentsDto> _service;

        public AssignmentsController(IService<AssignmentsDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<List<AssignmentsDto>> Get()
        {
            return await _service.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<AssignmentsDto> Get(int id)
        {
            return await _service.GetById(id);
        }

        [HttpPost]
        public async Task<AssignmentsDto> Post([FromBody] AssignmentsDto value)
        {
            return await _service.AddItem(value);
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] AssignmentsDto value)
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