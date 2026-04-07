using System.ComponentModel.DataAnnotations;

namespace VisitorRegistration.Api.Models;

public class Employee
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Position { get; set; } = string.Empty;

    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}
