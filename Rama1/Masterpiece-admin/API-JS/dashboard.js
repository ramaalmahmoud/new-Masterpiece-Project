// Fetch Dashboard Stats
async function fetchDashboardStats() {
    try {
      const response = await fetch('https://localhost:7084/api/Dashboard/stats');
      const data = await response.json();
      
      // Display stats in the HTML
      document.getElementById('totalUsers').textContent = data.totalUsers;
      document.getElementById('totalActivities').textContent = data.totalActivities;
      document.getElementById('totalSales').textContent = data.totalSales.toFixed(2); // format to 2 decimal places
      document.getElementById('totalOrders').textContent = data.totalOrders;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }
// Fetch Recent Customers
async function fetchRecentCustomers() {
    try {
        const response = await fetch('https://localhost:7084/api/Dashboard/recent-customers');
        const customers = await response.json();

        const customerList = document.getElementById('recentCustomersList');
        customerList.innerHTML = ''; // Clear any existing customers

        customers.forEach(customer => {
            const div = document.createElement('div');
            div.classList.add("item-list"); // Correct way to add class

            div.innerHTML = `
                <div class="avatar">
                    <img
                        src="assets/img/jm_denis.jpg"
                        alt="..."
                        class="avatar-img rounded-circle"
                    />
                </div>
                <div class="info-user ms-3">
                    <div class="username">${customer.fullName}</div>
                    <div class="status">${customer.userRole}</div>
                </div>
                <button class="btn btn-icon btn-link op-8 me-1" onclick="openGmail('${customer.email}')">
                    <i class="far fa-envelope"></i>
                </button>
                <button class="btn btn-icon btn-link btn-danger op-8" onclick="updateStatus(${customer.userId}, 'Inactive')">
                    <i class="fas fa-ban"></i>
                </button>
            `;
            
            customerList.appendChild(div); // Append the customer div to the list
        });
    } catch (error) {
        console.error('Error fetching recent customers:', error);
    }
}


async function updateStatus(userId, status) {
    const response = await fetch(`https://localhost:7084/api/User/updateStatus/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
    });

    if (response.ok) {
        alert('Status updated successfully');
        fetchUsers(); // Refresh the user list
    } else {
        alert('Failed to update status');
    }
}
async function openGmail(email) {
    // Implement your logic for sending an email to the user
    debugger
    const subject = "Response to Your Contact Message";
    const body = "Hello, your message has been received.";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function fetchTransactionHistory() {
    try {
      // Fetch data from the API
      const response = await fetch('https://localhost:7084/api/Dashboard/transaction-history');
      const transactions = await response.json();

      // Get the table body element
      const transactionTableBody = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];

      // Clear existing table rows
      transactionTableBody.innerHTML = '';

      // Loop through the transactions and append rows
      transactions.forEach(transaction => {
        const row = document.createElement('tr');

        // Create and append cells for each property in the transaction object
        const paymentIdCell = document.createElement('td');
        paymentIdCell.textContent = transaction.paymentId;
        row.appendChild(paymentIdCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = transaction.amount;
        row.appendChild(amountCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = transaction.paymentStatus;
        row.appendChild(statusCell);

        const paymentDateCell = document.createElement('td');
        const paymentDate = new Date(transaction.paymentDate);
        paymentDateCell.textContent = paymentDate.toLocaleString(); // Format date to a readable string
        row.appendChild(paymentDateCell);

        // Append the row to the table body
        transactionTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  }

  // Call the functions to load data when the page loads
window.onload = function() {
    fetchDashboardStats();
    fetchRecentCustomers();
    fetchTransactionHistory();
  }