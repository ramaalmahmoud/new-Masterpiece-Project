using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Doctor
{
    public int DoctorId { get; set; }

    public int? UserId { get; set; }

    public string? Specialization { get; set; }

    public int? ExperienceYears { get; set; }

    public string? ClinicAddress { get; set; }

    public bool? AvailableForVolunteering { get; set; }

    public decimal? ConsultationFee { get; set; }

    public string? AvailableTimes { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<DoctorAvailability> DoctorAvailabilities { get; set; } = new List<DoctorAvailability>();

    public virtual ICollection<PsychologicalSession> PsychologicalSessions { get; set; } = new List<PsychologicalSession>();

    public virtual User? User { get; set; }
}
