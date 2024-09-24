using System;
using System.Collections.Generic;

namespace master_piece_project.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? UserRole { get; set; }

    public string? ProfilePicture { get; set; }

    public byte[]? PasswordSalt { get; set; }

    public byte[]? PasswordHash { get; set; }

    public string? ResetToken { get; set; }

    public DateTime? TokenExpiration { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<ParentChat> ParentChatReceivers { get; set; } = new List<ParentChat>();

    public virtual ICollection<ParentChat> ParentChatSenders { get; set; } = new List<ParentChat>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<SavedPrintedActivity> SavedPrintedActivities { get; set; } = new List<SavedPrintedActivity>();

    public virtual ICollection<Suggestion> Suggestions { get; set; } = new List<Suggestion>();

    public virtual ICollection<UserFeedback> UserFeedbacks { get; set; } = new List<UserFeedback>();

    public virtual ICollection<Volunteer> Volunteers { get; set; } = new List<Volunteer>();
}
