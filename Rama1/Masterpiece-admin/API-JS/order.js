async function fetchOrders() {
    try {
        const response = await fetch("https://localhost:7084/api/Orders/GetOrder", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
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
    console.log("Orders received:", orders); // Log the orders received
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    orders.forEach(order => {
        const totalAmount = order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00';
        const row = document.createElement('tr');
        console.log("Order ID:", order.orderId); // Log each order ID
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.userName}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>$${totalAmount}</td>
            <td>${order.orderStatus}</td>
            <td>
                <a href="#" class="btn btn-primary btn-sm view-order-btn" data-bs-toggle="modal" data-bs-target="#viewOrderModal">View</a>
                <button class="btn btn-warning btn-sm update-order-btn" data-bs-toggle="modal" data-bs-target="#updateOrderModal">Update Status</button>
            </td>
        `;
        debugger
        row.querySelector('.view-order-btn').addEventListener('click', () => fetchOrderDetails(order.orderId));
        row.querySelector('.update-order-btn').addEventListener('click', () => setOrderId(order.orderId));
        tbody.appendChild(row);
    });
}
function setOrderId(orderId) {
    debugger
    // Set the order ID in the hidden input field
    document.getElementById('order-id').value = orderId;

    // Optionally update the modal title for confirmation
    document.querySelector('#updateOrderModalLabel').textContent = `Update Status for Order #${orderId}`;
}

// Call fetchOrders when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);

document.getElementById('updateOrderForm').addEventListener('submit', async function(event) {
    event.preventDefault();
debugger
    const updatedStatus = document.getElementById('orderStatus').value;
    const orderId = document.getElementById('order-id').value;

    if (!orderId) {
        console.error("Order ID is missing from the form.");
        return;
    }

    try {
        const response = await fetch(`https://localhost:7084/api/Orders/${orderId}`, {
            method: 'PUT', // Use PUT instead of POST
            headers: {
                'Content-Type': 'application/json' // Add the Content-Type header
            },
            body: JSON.stringify({ newStatus: updatedStatus }) // Send updatedStatus as part of a JSON object
        });

        if (!response.ok) {
            throw new Error("Failed to update order status");
        }

        // Refresh the table data after updating
        fetchOrders();

        // Hide the modal after submission
        const updateOrderModal = bootstrap.Modal.getInstance(document.getElementById('updateOrderModal'));
        updateOrderModal.hide();
    } catch (error) {
        console.error("Error updating order status:", error);
    }
});



// Function to fetch and display order details in the modal
async function fetchOrderDetails(orderId) {

    try {
        // Fetch order details from the API
        const response = await fetch(`https://localhost:7084/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order details');

        const order = await response.json();

        // Populate modal fields with order data
        document.getElementById('modal-order-id').textContent = order.orderId;
        document.getElementById('modal-user-name').textContent = order.customerName;
        document.getElementById('modal-order-date').textContent = new Date(order.orderDate).toLocaleDateString();
        document.getElementById('modal-total-amount').textContent = order.totalAmount.toFixed(2);
debugger
        // Populate the product list in the modal
        const productList = document.getElementById('modal-product-list');
        productList.innerHTML = ''; // Clear existing products

        order.items.forEach(product => {
            const Price = product.price != null ? product.price.toFixed(2) : '0.00';
            const totalPrice = product.totalPrice != null ? product.totalPrice.toFixed(2) : '0.00';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>$${Price}</td>
                <td>$${totalPrice}</td>
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

