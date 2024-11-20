using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using master_piece_project.Services;
using Microsoft.EntityFrameworkCore;

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
            var token = _tokenGenerator.GenerateToken(user.FullName, roles, user.UserId);

            return Ok(new { Token = token, UserId = user.UserId, UserRole = user.UserRole });
        }

        [HttpPost("addDoctors")]
        public IActionResult AddDoctors([FromForm] DoctorRequestDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                UserRole = "Doctor",
                ProfilePicture = model.ProfilePicture?.FileName,
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            var doctor = new Doctor
            {
                UserId = user.UserId,
                Specialization = model.Specialization,
                ExperienceYears = model.ExperienceYears,
                ClinicAddress = model.ClinicAddress,
                ConsultationFee = model.ConsultationFee,
            };

            _db.Doctors.Add(doctor);
            _db.SaveChanges();
            // Step 4: Add available times to DoctorAvailability table
            if (model.AvailableTimes != null )
            {
                foreach (var availableTime in model.AvailableTimes)
                {
                    var doctorAvailability = new DoctorAvailability
                    {
                        DoctorId = doctor.DoctorId,
                        //AvailableTime = availableTime,
                        IsBooked = false
                    };
                    _db.DoctorAvailabilities.Add(doctorAvailability);
                }

                _db.SaveChanges();
            }
            return Ok(new { message = "Doctor and availability added successfully." });
        }
        [HttpPost("addVolunteer")]
        public IActionResult AddVolunteer([FromForm] VolunteerRequestDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user exists
            var user =  _db.Users.Find(model.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var v=_db.Volunteers.FirstOrDefault(v=>v.UserId==model.UserId);
            if(v != null)
            {
                return BadRequest("yo've already apllied");
            }

            // Handle file uploads
            string resumePath = null;
            string certificatesPath = null;

            if (model.Resume != null)
            {
                resumePath = Path.Combine("Uploads", model.Resume.FileName);
                using (var stream = new FileStream(resumePath, FileMode.Create))
                {
                     model.Resume.CopyTo(stream);
                }
            }

            if (model.Certificates != null)
            {
                certificatesPath = Path.Combine("Uploads", model.Certificates.FileName);
                using (var stream = new FileStream(certificatesPath, FileMode.Create))
                {
                     model.Certificates.CopyTo(stream);
                }
            }

            // Create a new Volunteer record
            var volunteer = new Volunteer
            {
                UserId = model.UserId,
                VolunteerRole = model.VolunteerRole,
                Resume = resumePath,
                Certificates = certificatesPath,
                Availability = "Not Yet",
                WhyVolunteer = model.WhyVolunteer
            };

            _db.Volunteers.Add(volunteer);
             _db.SaveChanges();

            return Ok("Volunteer application submitted successfully.");
        }
        // Get users with optional search and status filter
        [HttpGet("getUsers")]
        public async Task<IActionResult> GetUsers([FromQuery] string search = "", [FromQuery] string status = "")
        {
            var query = _db.Users.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.FullName.Contains(search) || u.Email.Contains(search) || u.UserId.ToString().Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(u => u.Status == status);
            }

            var users = await query.ToListAsync();
            return Ok(users);
        }

        // Update user status
        [HttpPost("updateStatus/{id}")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] string newStatus)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Status = newStatus;
            await _db.SaveChangesAsync();

            return Ok("User status updated.");
        }
        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var user = _db.Users.FirstOrDefault(x => x.UserId == model.UserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!PasswordHasher.VerifyPasswordHash(model.CurrentPassword, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Current password is incorrect.");
            }

            // Generate new password hash and salt
            PasswordHasher.CreatePasswordHash(model.NewPassword, out byte[] newPasswordHash, out byte[] newPasswordSalt);

            user.PasswordHash = newPasswordHash;
            user.PasswordSalt = newPasswordSalt;
            _db.SaveChanges();

            return Ok("Password changed successfully.");
        }


    }
}
