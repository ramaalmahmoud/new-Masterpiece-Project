namespace master_piece_project.DTO
{
    public class CreateBlogPostRequest
    {
     
            public string? Title { get; set; }
            public string Content { get; set; }
            public int? AuthorID { get; set; } // This should be provided by the authenticated user
            public IFormFile? Image { get; set; } // URL or path of the image
            public string Category { get; set; } // Category of the blog post
        

    }
}
