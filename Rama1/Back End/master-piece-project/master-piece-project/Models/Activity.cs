﻿using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Activity
{
    public int ActivityId { get; set; }

    public string Title { get; set; } = null!;

    public string? Image { get; set; }

    public int CategoryId { get; set; }

    public string? AgeGroup { get; set; }

    public string? Duration { get; set; }

    public string? Suggestions { get; set; }

    public virtual ActivityCategory Category { get; set; } = null!;

    public virtual ICollection<Instruction> Instructions { get; set; } = new List<Instruction>();

    public virtual ICollection<Material> Materials { get; set; } = new List<Material>();

    public virtual ICollection<SavedPrintedActivity> SavedPrintedActivities { get; set; } = new List<SavedPrintedActivity>();

    public virtual ICollection<Suggestion> SuggestionsNavigation { get; set; } = new List<Suggestion>();
}
