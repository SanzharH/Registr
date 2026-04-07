using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VisitorRegistration.Api.Data;
using VisitorRegistration.Api.Dtos;

namespace VisitorRegistration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
    {
        var employees = await context.Employees
            .OrderBy(employee => employee.FullName)
            .Select(employee => new EmployeeDto
            {
                Id = employee.Id,
                FullName = employee.FullName,
                Position = employee.Position
            })
            .ToListAsync();

        return Ok(employees);
    }
}
