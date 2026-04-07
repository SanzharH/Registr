using System.ComponentModel.DataAnnotations;

namespace VisitorRegistration.Api.Models;

public class Visit
{
    public int Id { get; set; }

    public int VisitorId { get; set; }
    public Visitor? Visitor { get; set; }

    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }

    [Required]
    [MaxLength(200)]
    public string Purpose { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string PassNumber { get; set; } = string.Empty;

    public DateTime EntryTime { get; set; } = DateTime.UtcNow;
    public DateTime? ExitTime { get; set; }
}
