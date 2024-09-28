﻿using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int ProductId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UserId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User? User { get; set; }
}
