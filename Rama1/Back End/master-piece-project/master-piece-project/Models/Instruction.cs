using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Instruction
{
    public int InstructionId { get; set; }

    public int? ActivityId { get; set; }

    public int StepNumber { get; set; }

    public string? InstructionText { get; set; }

    public string? ImageUrl { get; set; }

    public virtual Activity? Activity { get; set; }
}
