using Application.Activities.Queries;
using Microsoft.EntityFrameworkCore;
using Persistence;
using FluentValidation;
using Application.Activities.Validators;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors();
builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();   // Register all handlers in the assembly
    config.AddOpenBehavior(typeof(Application.Core.ValidationBehaviour<,>));    // Register the validation middleware
});
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();
builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

// Configure the HTTP request pipeline (Middleware - the ordering matter).

app.UseMiddleware<ExceptionMiddleware>(); // Custom exception handling middleware

app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000", "https://localhost:3000"));
app.MapControllers();

//service locator pattern
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
