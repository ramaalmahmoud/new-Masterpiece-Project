using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Order
{
    internal readonly object Links;

    public int OrderId { get; set; }

    public int? UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? ShippingAddress { get; set; }

    public string? OrderStatus { get; set; }

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public virtual User? User { get; set; }
}
