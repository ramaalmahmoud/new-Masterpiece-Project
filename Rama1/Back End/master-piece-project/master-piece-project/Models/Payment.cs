using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int? UserId { get; set; }

    public string? PaymentType { get; set; }

    public decimal? Amount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentStatus { get; set; }

    public int? AppointmentId { get; set; }

    public int? OrderId { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual Order? Order { get; set; }

    public virtual User? User { get; set; }
}
