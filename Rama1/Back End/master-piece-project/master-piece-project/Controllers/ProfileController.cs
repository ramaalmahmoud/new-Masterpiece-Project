using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly MyDbContext _db;
        public ProfileController(MyDbContext db)
        {
            _db = db;
        }
        [HttpGet("api/user/{id}")]
        public IActionResult GetUserDetails(int id)
        {
            var user =  _db.Users
                .Where(u => u.UserId == id)
                .Select(u => new
                {
                    u.FullName,
                    u.Email,
                    u.ProfilePicture,
                    u.PhoneNumber,
                    u.UserRole,
                    u.UserId
                })
                .FirstOrDefault();

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("api/user/{id}")]
        public IActionResult UpdateUserDetails(int id, [FromForm] UpdateUserModel model)
        {
            var user =  _db.Users.Find(id);
            if (user == null)
                return NotFound();

            user.FullName = model.FullName ?? user.FullName;
            user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;
            if (model.ProfilePicture != null && model.ProfilePicture.Length > 0)
            {
                var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }
                var filePath = Path.Combine(uploadsFolderPath, model.ProfilePicture.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    model.ProfilePicture.CopyTo(stream);
                }
            }
            user.ProfilePicture = model.ProfilePicture?.FileName;


            _db.SaveChanges();

            return Ok();
        }

        //[HttpPost("api/user/changepicture/{id}")]
        //public IActionResult ChangeProfilePicture(int id, [FromForm] IFormFile file)
        //{
        //    var user =  _db.Users.Find(id);
        //    if (user == null)
        //        return NotFound();

        //    if (file.Length > 0)
        //    {
        //        using (var ms = new MemoryStream())
        //        {
        //             file.CopyTo(ms);
        //            user.ProfilePicture = Convert.ToBase64String(ms.ToArray());
        //        }
        //    }

        //     _db.SaveChanges();

        //    return Ok();
        //}



    }
}
