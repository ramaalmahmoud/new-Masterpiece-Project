using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AppointmentController : ControllerBase
    {
        private readonly MyDbContext _db;
        public AppointmentController(MyDbContext db)
        {
            _db = db;
        }

        // GET: api/Doctor
        [HttpGet("getDoctors")]
        public IActionResult GetDoctors()
        
        {
            var doctors = _db.Doctors
                             .Join(_db.Users,
                                   doctor => doctor.UserId,  // Foreign key in Doctor table
                                   user => user.UserId,      // Primary key in User table
                                   (doctor, user) => new
                                   {
                                       DoctorId = doctor.DoctorId,
                                       FullName = user.FullName,  // Fetch full name from User
                                       Specialization = doctor.Specialization
                                   })
                             .ToList();

            return Ok(doctors);
        }
        // GET: api/PsychologicalSession/programs
        [HttpGet("programs")]
        public IActionResult GetProgramNames()
        {
            // Retrieve distinct session types (program names) from the PsychologicalSession table synchronously
            var sessionTypes = _db.PsychologicalSessions
                                        .Where(s => !string.IsNullOrEmpty(s.SessionType))
                                        .Select(s => s.SessionType)
                                        .Distinct()
                                        .ToList();

            if (sessionTypes == null || sessionTypes.Count == 0)
            {
                return NotFound("No programs found.");
            }

            return Ok(sessionTypes);
        }
        //
        // POST: Book an appointment (Synchronous Version)
        [HttpPost("book")]
        public IActionResult BookAppointment([FromForm] AppointmentRequestDTO appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ensure UserId is provided
            if (appointmentDto.UserId == null)
            {
                return BadRequest("UserId is required.");
            }

            // Create a new Appointment object
            var appointment = new Appointment
            {
                UserId = appointmentDto.UserId,  // Using UserId from DTO
                DoctorId = appointmentDto.DoctorId,
                AppointmentDate = BitConverter.GetBytes(appointmentDto.AppointmentDate.ToBinary()),
                SessionType = appointmentDto.SessionType,
                Notes = appointmentDto.Message
            };

            // Add the appointment to the database and save changes
            _db.Appointments.Add(appointment);
            _db.SaveChanges();

            return Ok("Appointment booked successfully");
        }

    }
}
