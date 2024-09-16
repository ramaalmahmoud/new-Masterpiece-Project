using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class ActivityCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();
}
