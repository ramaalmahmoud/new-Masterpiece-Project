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
var config = ConfigManager.Instance.GetProperties();
config["clientId"] = "AWoQADMAX_vx7WgYgVwr-SiD03yiKLNGdEqcAAJVWhoxvD1UIHRwIsi3O7Ha4RgxaOORA5ZCocdcfTMI"; // استبدل بـ Client ID الخاص بك
config["clientSecret"] = "EGXwZlz6_I5K4HUN4BBNg8yqb79L3GNWZkahwu8qcIDVnUx9kNHO961d9HwagTiFTKtf2AWCEmwAlBQ3"; // استبدل بـ Secret الخاص بك
config["mode"] = "sandbox";
builder.Services.AddSingleton<TokenGenerator>();
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
        var jwtSettings = builder.Configuration.GetSection("Jwt");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("client", policy => policy.RequireRole("client"));
});
// PayPal Service Injection
//builder.Services.AddSingleton<PayPalService>(sp =>
//{
//    // You can get these values from your appsettings.json or environment variables
//    var clientId = builder.Configuration["PayPal:ClientId"];
//    var clientSecret = builder.Configuration["PayPal:ClientSecret"];

//    // Ensure you toggle this flag for live/sandbox environments
//    var isLive = builder.Configuration.GetValue<bool>("PayPal:IsLive");

//    return new PayPalService(clientId, clientSecret, isLive);
//});

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
