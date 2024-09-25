namespace master_piece_project.DTO
{
    public class SubmitCommentDto
    {
        public int PostId { get; set; }  // The ID of the blog post to which the comment belongs
        public string Name { get; set; }  // The name of the user submitting the comment
        public string Email { get; set; }  // The email of the user submitting the comment
        public string CommentText { get; set; }  // The content of the comment
    }
}
