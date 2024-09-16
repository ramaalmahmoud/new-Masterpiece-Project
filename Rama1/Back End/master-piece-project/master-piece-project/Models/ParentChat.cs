using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class ParentChat
{
    public int ChatId { get; set; }

    public int? SenderId { get; set; }

    public int? ReceiverId { get; set; }

    public string? Message { get; set; }

    public DateTime? SentAt { get; set; }

    public virtual User? Receiver { get; set; }

    public virtual User? Sender { get; set; }
}
