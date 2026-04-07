using Microsoft.EntityFrameworkCore;
using VisitorRegistration.Api.Models;

namespace VisitorRegistration.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Visitor> Visitors => Set<Visitor>();
    public DbSet<Visit> Visits => Set<Visit>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Visitor>()
            .HasIndex(visitor => visitor.DocumentNumber)
            .IsUnique();

        modelBuilder.Entity<Visit>()
            .HasOne(visit => visit.Visitor)
            .WithMany(visitor => visitor.Visits)
            .HasForeignKey(visit => visit.VisitorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Visit>()
            .HasOne(visit => visit.Employee)
            .WithMany(employee => employee.Visits)
            .HasForeignKey(visit => visit.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
