using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class BlogPost
{
    public int PostId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public int? AuthorId { get; set; }

    public string? Image { get; set; }

    public int? CommentsCount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Category { get; set; }

    public bool? IsConfirmed { get; set; }

    public virtual User? Author { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
