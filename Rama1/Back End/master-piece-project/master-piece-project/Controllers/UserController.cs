using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using master_piece_project.Services;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _db;
        private readonly TokenGenerator _tokenGenerator;

        public UserController(MyDbContext db, TokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;

        }
        [HttpPost("createAccount")]
        public ActionResult Register([FromForm] UserDTO model)
        {
            if (model.Password != model.RepeatedPassword)
            {
                return BadRequest();
            }
            var existingUser = _db.Users.FirstOrDefault(x => x.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest("this email is already exist");
            }
            byte[] passwordHash, passwordSalt;
            PasswordHasher.CreatePasswordHash(model.Password, out passwordHash, out passwordSalt);

            User user = new User
            {

                FullName = model.FullName,

                Email = model.Email,

                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                UserRole = "client"
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok(user);
        }
        [HttpPost("login")]
        public IActionResult Login([FromForm] loginUserDTO model)
        {
            var user = _db.Users.FirstOrDefault(x => x.Email == model.Email);


            if (user == null || !PasswordHasher.VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid username or password.");
            }

            var roles = _db.Users.Where(r => r.UserId == user.UserId).Select(r => r.UserRole).ToList();
            var token = _tokenGenerator.GenerateToken(user.FullName, roles);
            // Generate a token or return a success response
           
            return Ok(new { Token = token, UserId = user.UserId });
        }

    }
}
