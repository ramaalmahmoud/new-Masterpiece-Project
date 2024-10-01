﻿using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Category
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Image { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
