using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int? UserId { get; set; }

    public int? DoctorId { get; set; }

    public string? SessionType { get; set; }

    public string? Notes { get; set; }

    public DateTime? AppointmentDate { get; set; }

    public virtual Doctor? Doctor { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual User? User { get; set; }
}
