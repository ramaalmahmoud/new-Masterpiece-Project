using master_piece_project.Models;
using Microsoft.AspNetCore.SignalR;

namespace master_piece_project.Hubs
{
    public class ChatHub : Hub
    {
        private readonly MyDbContext _context;
        public ChatHub(MyDbContext context)
        {
            _context = context;
        }

        public async Task SendMessage(int userId, string message)
        {
            var chatMessage = new ParentChat
            {
                SenderId = userId,
                Message = message,
                SentAt = DateTime.Now
            };

            _context.ParentChats.Add(chatMessage);
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("ReceiveMessage", userId, message);
        }
    }

}
