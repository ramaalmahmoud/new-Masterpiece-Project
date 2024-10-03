﻿namespace master_piece_project.DTO
{
    public class addProductDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public IFormFile? Image { get; set; }
    }
}
