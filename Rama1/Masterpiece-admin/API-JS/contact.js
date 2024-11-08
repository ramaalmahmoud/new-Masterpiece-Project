  // Delete a contact message by ID
  async function deleteMessage(id) {
    debugger
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
        const response = await fetch(`https://localhost:7084/api/Contact/delete/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Message deleted successfully.");
            fetchContactMessages(); // Refresh the list
        } else {
            alert("Failed to delete message.");
        }
    } catch (error) {
        console.error("Error deleting message:", error);
    }
}

// Respond by email and hide the button
async function respondToMessage(id, button) {
    debugger
    const responseMessage = prompt("Enter your response message:");

    if (responseMessage) {
        try {
            const response = await fetch(`https://localhost:7084/api/Contact/respond/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
                },
                body: JSON.stringify(responseMessage)
            });

            if (response.ok) {
                alert("Response email sent successfully.");
                // Hide the button after responding
                button.style.display = "none";
                // Store in localStorage to remember the response
                localStorage.setItem(`responded_${id}`, true);
            } else {
                alert("Failed to send response email.");
            }
        } catch (error) {
            console.error("Error responding to message:", error);
        }
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#contact-messages-table tbody");

    // Fetch all contact messages from the API
    async function fetchContactMessages() {
        try {
            const response = await fetch("https://localhost:7084/api/Contact/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch contact messages");
            }

            const messages = await response.json();
            populateTable(messages);
        } catch (error) {
            console.error("Error fetching contact messages:", error);
        }
    }

    // Populate table with fetched messages
    function populateTable(messages) {
        tableBody.innerHTML = ""; // Clear existing rows


        messages.forEach((message) => {
            const responded = localStorage.getItem(`responded_${message.id}`) === 'true'; // Check localStorage

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${message.id}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.phone}</td>
                <td>${message.contactReason}</td>
                <td>${message.message}</td>
                <td>${message.submittedAt ? new Date(message.submittedAt).toLocaleString() : "N/A"}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteMessage(${message.id})">Delete</button>
                <button class="btn btn-warning btn-sm" onclick="respondToMessage(${message.id}, this)" ${responded ? 'style="display:none;"' : ''}>Respond</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

  
   

    // Fetch and display messages on page load
    fetchContactMessages();
});
