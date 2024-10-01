// Assuming you have already added SignalR script in your HTML
// <script src="/lib/signalr/signalr.js"></script>
debugger
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7084/chatHub") // Make sure this matches your hub URL
    .build();
debugger
// Start the connection
connection.start()
    .then(() => {
        debugger
        console.log("Connected to SignalR Hub!");
        debugger
        // Fetch chat history on load
        fetchChatHistory();
    })
    .catch(err => console.error(err));
debugger
// Function to send messages
const sendMessage = (event) => {
    debugger
    event.preventDefault(); // Prevent form submission

    const messageInput = document.querySelector('.chat-platform__input');
    debugger
    const message = messageInput.value;

    if (message) {
        debugger
        // Call the send message method on the hub
        connection.invoke("SendMessage", message)
            .catch(err => console.error(err));
debugger
        // Clear the input
        messageInput.value = '';
    }
};
debugger
// Receive messages from the hub
connection.on("ReceiveMessage", (sender, message) => {
    debugger
    const messagesContainer = document.querySelector('.chat-platform__messages');
debugger
    // Create a new message element
    const newMessage = document.createElement('div');
    debugger
    newMessage.classList.add('chat-platform__message');
debugger
    // Check if the sender is the current user (you may want to implement a way to get the current user's ID)
    const isUser = sender === 1; // Replace with your logic to check the current user's ID
    debugger
    newMessage.classList.add(isUser ? 'chat-platform__message--user' : 'chat-platform__message--response');
debugger
    // Append message content
    newMessage.innerHTML = `<p><strong>${sender}:</strong> ${message}</p>`;
    debugger
    // Append to messages container
    messagesContainer.appendChild(newMessage);

    // Scroll to the bottom of the chat
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
debugger
// Fetch chat history
const fetchChatHistory = () => {
    debugger
    fetch("https://localhost:7084/api/Chat") // Replace with your API endpoint
        .then(response => response.json())
        .then(messages => {
            const messagesContainer = document.querySelector('.chat-platform__messages');
            messagesContainer.innerHTML = ''; // Clear existing messages
debugger
            messages.forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-platform__message');
debugger
                // Check if the sender is the current user
                const isUser = msg.senderId === "YourUserId"; // Replace with your logic
                messageElement.classList.add(isUser ? 'chat-platform__message--user' : 'chat-platform__message--response');

                messageElement.innerHTML = `<p><strong>${msg.senderName}:</strong> ${msg.message}</p>`;
                messagesContainer.appendChild(messageElement);
            });
debugger
            // Scroll to the bottom of the chat
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(err => console.error(err));
};
debugger
// Attach sendMessage function to the form submit
document.querySelector('.chat-platform__form').addEventListener('submit', sendMessage);
