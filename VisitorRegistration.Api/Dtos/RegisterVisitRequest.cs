using System.ComponentModel.DataAnnotations;

namespace VisitorRegistration.Api.Dtos;

public class RegisterVisitRequest
{
    [Required(ErrorMessage = "Укажите ФИО посетителя.")]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Укажите номер документа.")]
    [MaxLength(50)]
    public string DocumentNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Выберите принимающего сотрудника.")]
    public int EmployeeId { get; set; }

    [Required(ErrorMessage = "Укажите цель визита.")]
    [MaxLength(200)]
    public string Purpose { get; set; } = string.Empty;
}
