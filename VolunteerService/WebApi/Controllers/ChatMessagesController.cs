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
    public class ChatMessagesController : ControllerBase
    {
        private readonly IService<ChatMessagesDto> _service;

        public ChatMessagesController(IService<ChatMessagesDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<List<ChatMessagesDto>> Get()
        {
            return await _service.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<ChatMessagesDto> Get(int id)
        {
            return await _service.GetById(id);
        }

        [HttpPost]
        public async Task<ChatMessagesDto> Post([FromBody] ChatMessagesDto value)
        {
            return await _service.AddItem(value);
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] ChatMessagesDto value)
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