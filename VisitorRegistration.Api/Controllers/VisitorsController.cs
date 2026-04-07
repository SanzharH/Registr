using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VisitorRegistration.Api.Data;

namespace VisitorRegistration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitorsController(AppDbContext context) : ControllerBase
{
    [HttpGet("search")]
    public async Task<IActionResult> SearchVisitors([FromQuery] string? query)
    {
        var normalizedQuery = query?.Trim().ToLower();

        var visitorsQuery = context.Visitors.AsQueryable();

        if (!string.IsNullOrWhiteSpace(normalizedQuery))
        {
            visitorsQuery = visitorsQuery.Where(visitor =>
                visitor.FullName.ToLower().Contains(normalizedQuery) ||
                visitor.DocumentNumber.ToLower().Contains(normalizedQuery));
        }

        var visitors = await visitorsQuery
            .OrderBy(visitor => visitor.FullName)
            .Select(visitor => new
            {
                visitor.Id,
                visitor.FullName,
                visitor.DocumentNumber,
                visitor.CreatedAt
            })
            .ToListAsync();

        return Ok(visitors);
    }
}
