using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VisitorRegistration.Api.Data;
using VisitorRegistration.Api.Dtos;
using VisitorRegistration.Api.Models;

namespace VisitorRegistration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitsController(AppDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RegisterVisit([FromBody] RegisterVisitRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var employee = await context.Employees.FindAsync(request.EmployeeId);
        if (employee is null)
        {
            return NotFound(new { message = "Сотрудник не найден." });
        }

        var normalizedDocument = request.DocumentNumber.Trim();
        var normalizedName = request.FullName.Trim();

        var visitor = await context.Visitors
            .FirstOrDefaultAsync(item => item.DocumentNumber == normalizedDocument);

        if (visitor is null)
        {
            visitor = new Visitor
            {
                FullName = normalizedName,
                DocumentNumber = normalizedDocument
            };

            context.Visitors.Add(visitor);
        }
        else
        {
            visitor.FullName = normalizedName;
        }

        var hasActiveVisit = visitor.Id != 0 && await context.Visits
            .AnyAsync(visit => visit.VisitorId == visitor.Id && visit.ExitTime == null);

        if (hasActiveVisit)
        {
            return Conflict(new { message = "У посетителя уже есть активный визит." });
        }

        var visit = new Visit
        {
            Visitor = visitor,
            EmployeeId = employee.Id,
            Purpose = request.Purpose.Trim(),
            EntryTime = DateTime.UtcNow,
            PassNumber = GeneratePassNumber()
        };

        context.Visits.Add(visit);
        await context.SaveChangesAsync();

        await context.Entry(visit).Reference(item => item.Visitor).LoadAsync();
        await context.Entry(visit).Reference(item => item.Employee).LoadAsync();

        return Created(string.Empty, MapVisit(visit));
    }

    [HttpPut("{id}/exit")]
    public async Task<IActionResult> RegisterExit(int id)
    {
        var visit = await context.Visits
            .Include(item => item.Visitor)
            .Include(item => item.Employee)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (visit is null)
        {
            return NotFound(new { message = "Визит не найден." });
        }

        if (visit.ExitTime.HasValue)
        {
            return BadRequest(new { message = "Выход уже был зарегистрирован ранее." });
        }

        visit.ExitTime = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return Ok(MapVisit(visit));
    }

    [HttpGet("current")]
    public async Task<ActionResult<IEnumerable<VisitDto>>> GetCurrentVisitors()
    {
        var visits = await context.Visits
            .Include(visit => visit.Visitor)
            .Include(visit => visit.Employee)
            .Where(visit => visit.ExitTime == null)
            .OrderByDescending(visit => visit.EntryTime)
            .ToListAsync();

        return Ok(visits.Select(MapVisit));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VisitDto>>> GetVisits([FromQuery] string? query)
    {
        var normalizedQuery = query?.Trim().ToLower();

        var visitsQuery = context.Visits
            .Include(visit => visit.Visitor)
            .Include(visit => visit.Employee)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(normalizedQuery))
        {
            visitsQuery = visitsQuery.Where(visit =>
                visit.Visitor != null &&
                (visit.Visitor.FullName.ToLower().Contains(normalizedQuery) ||
                 visit.Visitor.DocumentNumber.ToLower().Contains(normalizedQuery)));
        }

        var visits = await visitsQuery
            .OrderByDescending(visit => visit.EntryTime)
            .ToListAsync();

        return Ok(visits.Select(MapVisit));
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportToCsv([FromQuery] string? query)
    {
        var normalizedQuery = query?.Trim().ToLower();

        var visitsQuery = context.Visits
            .Include(visit => visit.Visitor)
            .Include(visit => visit.Employee)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(normalizedQuery))
        {
            visitsQuery = visitsQuery.Where(visit =>
                visit.Visitor != null &&
                (visit.Visitor.FullName.ToLower().Contains(normalizedQuery) ||
                 visit.Visitor.DocumentNumber.ToLower().Contains(normalizedQuery)));
        }

        var visits = await visitsQuery
            .OrderByDescending(visit => visit.EntryTime)
            .ToListAsync();

        var builder = new StringBuilder();
        builder.AppendLine("Id,ФИО,Документ,Сотрудник,Цель,НомерПропуска,Вход,Выход");

        // CSV-отчёт нужен для демонстрации простой отчётности без усложнения системы.
        foreach (var visit in visits.Select(MapVisit))
        {
            builder.AppendLine(string.Join(",",
                visit.Id,
                EscapeCsv(visit.FullName),
                EscapeCsv(visit.DocumentNumber),
                EscapeCsv(visit.EmployeeName),
                EscapeCsv(visit.Purpose),
                EscapeCsv(visit.PassNumber),
                visit.EntryTime.ToLocalTime().ToString("dd.MM.yyyy HH:mm", CultureInfo.InvariantCulture),
                visit.ExitTime?.ToLocalTime().ToString("dd.MM.yyyy HH:mm", CultureInfo.InvariantCulture) ?? string.Empty));
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(builder.ToString())).ToArray();
        return File(bytes, "text/csv", "visits-report.csv");
    }

    private static VisitDto MapVisit(Visit visit)
    {
        return new VisitDto
        {
            Id = visit.Id,
            VisitorId = visit.VisitorId,
            FullName = visit.Visitor?.FullName ?? string.Empty,
            DocumentNumber = visit.Visitor?.DocumentNumber ?? string.Empty,
            EmployeeName = visit.Employee?.FullName ?? string.Empty,
            Purpose = visit.Purpose,
            PassNumber = visit.PassNumber,
            EntryTime = visit.EntryTime,
            ExitTime = visit.ExitTime
        };
    }

    private static string GeneratePassNumber()
    {
        return $"PR-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }

    private static string EscapeCsv(string value)
    {
        return $"\"{value.Replace("\"", "\"\"")}\"";
    }
}
