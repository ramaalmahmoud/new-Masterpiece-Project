async function fetchOrders() {
    try {
        const response = await fetch("https://localhost:7084/api/Orders/GetOrder", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}` // Adjust if needed
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        const orders = await response.json();
        populateOrdersTable(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

function populateOrdersTable(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userName}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>$${order.totalAmount.toFixed(2)}</td>
            <td>${order.orderStatus}</td>
            <td>
                <a href="/admin/view-order/${order.orderId}" class="btn btn-primary btn-sm">View</a>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#updateOrderModal" data-orderid="${order.orderId}">Update Status</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Re-attach click event listener for dynamic buttons
    attachModalTrigger();
}

function attachModalTrigger() {
    debugger
    document.querySelectorAll('button[data-bs-target="#updateOrderModal"]').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = this.getAttribute('data-orderid');
            document.getElementById('updateOrderModalLabel').textContent = `Update Status for Order #${orderId}`;
            // You might want to store the orderId in a hidden input or variable for later use in the update process
        });
    });
}

// Call fetchOrders when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);

// Handling the form submission for updating the order status
document.getElementById('updateOrderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const updatedStatus = document.getElementById('orderStatus').value;
    const orderId = document.querySelector('#updateOrderModalLabel').textContent.split('#')[1].trim();

    try {
        const response = await fetch(`https://localhost:7084/api/Orders/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            body: JSON.stringify(updatedStatus)
        });

        if (!response.ok) {
            throw new Error("Failed to update order status");
        }

        // Optionally, refresh the table data after updating
        await fetchOrders();

        // Hide the modal after submission
        const updateOrderModal = new bootstrap.Modal(document.getElementById('updateOrderModal'));
        updateOrderModal.hide();
    } catch (error) {
        console.error("Error updating order status:", error);
    }
});
