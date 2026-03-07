using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Interfaces;
using Service.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IService<UsersDto> _service;

        public UsersController(IService<UsersDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<List<UsersDto>> Get()
        {
            return await _service.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<UsersDto> Get(int id)
        {
            return await _service.GetById(id);
        }

        [HttpPost]
        public async Task<UsersDto> Post([FromBody] UsersDto value)
        {
            return await _service.AddItem(value);
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] UsersDto value)
        {
            await _service.UpdateItem(id, value);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _service.DeleteItem(id);
        }
        // הוספה של קטגוריה
       

        // הסרה של קטגוריה
        [HttpDelete("{userId}/category/{categoryId}")]
        public async Task<IActionResult> RemoveCategoryFromUser(int userId, int categoryId)
        {
            await (_service as UsersService)?.RemoveCategoryFromUser(userId, categoryId);
            return Ok();
        }
        [HttpPost("{userId}/category/{categoryId}")]
        public async Task<IActionResult> AddCategoryToUser(int userId, int categoryId)
        {
            await (_service as UsersService)?.AddCategoryToUser(userId, categoryId);
            return Ok();
        }
    }
}
