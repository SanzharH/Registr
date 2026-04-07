using System.ComponentModel.DataAnnotations;

namespace VisitorRegistration.Api.Models;

public class Visitor
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string DocumentNumber { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}
