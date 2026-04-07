using VisitorRegistration.Api.Models;

namespace VisitorRegistration.Api.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Employees.Any())
        {
            return;
        }

        var employees = new[]
        {
            new Employee { FullName = "Иванов Сергей Петрович", Position = "Администратор" },
            new Employee { FullName = "Смирнова Анна Викторовна", Position = "Специалист отдела кадров" },
            new Employee { FullName = "Кузнецов Дмитрий Олегович", Position = "Преподаватель" }
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();
    }
}
