namespace VisitorRegistration.Api.Dtos;

public class VisitDto
{
    public int Id { get; set; }
    public int VisitorId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public string PassNumber { get; set; } = string.Empty;
    public DateTime EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
}
