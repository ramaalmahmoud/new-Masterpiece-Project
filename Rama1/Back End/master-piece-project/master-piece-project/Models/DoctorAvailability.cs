using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class DoctorAvailability
{
    public int DoctorAvailabilityId { get; set; }

    public int DoctorId { get; set; }

    public DateTime AvailableTime { get; set; }

    public bool IsBooked { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;
}
