using master_piece_project.Models;
using Microsoft.EntityFrameworkCore;
using master_piece_project.Controllers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using master_piece_project.Services;
using master_piece_project.Hubs;
using PayPal.Api;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<IPayPalClient, PayPalClient>();
builder.Services.AddSignalR(); // Add SignalR service

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("YourConnectionString")));
builder.Services.AddCors(options =>
    options.AddPolicy("development", builder =>
    {
        builder.AllowAnyOrigin();
        builder.AllowAnyMethod();
        builder.AllowAnyHeader();
    })
);

// Add PayPal configuration
var config = ConfigManager.Instance.GetProperties();
config["clientId"] = builder.Configuration["PayPal:ClientId"]; // from appsettings.json
config["clientSecret"] = builder.Configuration["PayPal:ClientSecret"]; // from appsettings.json
config["mode"] = "sandbox"; // or "live" depending on environment



// Register PayPalService with DI container
builder.Services.AddSingleton<PayPalService>(sp =>
{
    var clientId = builder.Configuration["PayPal:ClientId"];
    var clientSecret = builder.Configuration["PayPal:ClientSecret"];
    var isLive = builder.Configuration.GetValue<bool>("PayPal:IsLive");
    return new PayPalService(clientId, clientSecret, isLive);
});

builder.Services.AddSingleton<TokenGenerator>();

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = jwtSettings.GetValue<string>("Key");
var issuer = jwtSettings.GetValue<string>("Issuer");
var audience = jwtSettings.GetValue<string>("Audience");

if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
{
    throw new InvalidOperationException("JWT settings are not properly configured.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("client", policy => policy.RequireRole("client"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("development");

app.MapControllers();

// Map the SignalR hub for the chat
app.MapHub<ChatHub>("/chatHub"); // Add SignalR Hub Mapping here

app.Run();
