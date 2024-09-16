using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class UserFeedback
{
    public int FeedbackId { get; set; }

    public int? UserId { get; set; }

    public int? ContentId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public virtual User? User { get; set; }
}
