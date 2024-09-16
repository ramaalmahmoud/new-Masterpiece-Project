using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class PsychologicalSession
{
    public int SessionId { get; set; }

    public string? SessionType { get; set; }

    public decimal? Price { get; set; }

    public string? Description { get; set; }

    public int? DoctorId { get; set; }

    public virtual Doctor? Doctor { get; set; }
}
