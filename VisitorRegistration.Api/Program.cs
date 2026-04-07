using Microsoft.EntityFrameworkCore;
using VisitorRegistration.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Оставляем только консольный лог, чтобы учебный проект стабильно запускался локально.
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var databaseDirectory = Path.Combine(Path.GetTempPath(), "visitor-registration-mvp");
Directory.CreateDirectory(databaseDirectory);
var databasePath = Path.Combine(databaseDirectory, "visitor-registration.db");

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message = "Внутренняя ошибка сервера." });
    });
});

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Для учебного MVP достаточно автоматически создать БД при первом запуске.
    dbContext.Database.EnsureCreated();
    SeedData.Initialize(dbContext);
}

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
