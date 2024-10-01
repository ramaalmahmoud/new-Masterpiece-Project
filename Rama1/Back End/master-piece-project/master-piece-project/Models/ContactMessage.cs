using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class ContactMessage
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string ContactReason { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime? SubmittedAt { get; set; }
}
