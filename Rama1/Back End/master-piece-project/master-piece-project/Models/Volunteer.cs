using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Volunteer
{
    public int VolunteerId { get; set; }

    public int? UserId { get; set; }

    public string? VolunteerRole { get; set; }

    public string? Resume { get; set; }

    public string? Certificates { get; set; }

    public string? Availability { get; set; }

    public string? WhyVolunteer { get; set; }

    public virtual User? User { get; set; }
}
