using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int? UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? ShippingAddress { get; set; }

    public string? OrderStatus { get; set; }

    public virtual User? User { get; set; }
}
