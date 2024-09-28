using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Material
{
    public int MaterialId { get; set; }

    public string Name { get; set; } = null!;

    public int ActivityId { get; set; }

    public virtual Activity Activity { get; set; } = null!;
}
