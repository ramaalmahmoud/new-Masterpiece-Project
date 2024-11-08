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
<a href="#" class="btn btn-primary btn-sm view-order-btn" data-orderid="${order.orderId}" data-bs-toggle="modal" data-bs-target="#viewOrderModal">View</a>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#updateOrderModal" data-orderid="${order.orderId}">Update Status</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Re-attach click event listener for dynamic buttons
    attachModalTrigger();
}

function attachModalTrigger() {
    document.querySelectorAll('.btn-warning').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const orderId = this.getAttribute('data-orderid');
            document.querySelector('#updateOrderModalLabel').textContent = `Update Status for Order #${orderId}`;
            document.querySelector('#updateOrderModal').setAttribute('data-orderid', orderId);
        });
    });
}


// Call fetchOrders when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);

// Handling the form submission for updating the order status
document.getElementById('updateOrderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const updatedStatus = document.getElementById('orderStatus').value;
    const orderId = document.querySelector('#updateOrderModal').getAttribute('data-orderid');

    try {
        const response = await fetch(`https://localhost:7084/api/Orders/${orderId}`, {
            method: 'PUT', // Use PUT instead of POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            body: JSON.stringify(updatedStatus) // Ensure the status is sent as a JSON string
        });

        if (!response.ok) {
            throw new Error("Failed to update order status");
        }

        // Optionally, refresh the table data after updating
        await fetchOrders();

        // Hide the modal after submission
        const updateOrderModal = bootstrap.Modal.getInstance(document.getElementById('updateOrderModal'));
        updateOrderModal.hide();
    } catch (error) {
        console.error("Error updating order status:", error);
    }
});

// Function to attach event listeners to "View" buttons after table rendering
function attachModalTrigger() {
    debugger
    document.querySelectorAll('.view-order-btn').forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const orderId = this.getAttribute('data-orderid');
            await fetchOrderDetails(orderId);
        });
    });
}

// Function to fetch and display order details in the modal
async function fetchOrderDetails(orderId) {
    debugger
    try {
        // Fetch order details from the API
        const response = await fetch(`https://localhost:7084/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order details');

        const order = await response.json();

        // Populate modal fields with order data
        document.getElementById('modal-order-id').textContent = order.orderId;
        document.getElementById('modal-user-name').textContent = order.userName;
        document.getElementById('modal-order-date').textContent = new Date(order.orderDate).toLocaleDateString();
        document.getElementById('modal-total-amount').textContent = order.totalAmount.toFixed(2);

        // Populate the product list in the modal
        const productList = document.getElementById('modal-product-list');
        productList.innerHTML = ''; // Clear existing products

        order.orderProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${(product.price * product.quantity).toFixed(2)}</td>
            `;
            productList.appendChild(row);
        });

        // Show the modal
        const viewOrderModal = new bootstrap.Modal(document.getElementById('viewOrderModal'));
        viewOrderModal.show();
    } catch (error) {
        console.error('Error:', error);
        alert('Could not load order details.');
    }
}

// Run the initial function to attach triggers
attachModalTrigger();


