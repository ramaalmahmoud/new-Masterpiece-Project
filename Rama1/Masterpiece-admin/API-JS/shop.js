async function loadCategories() {
    const response = await fetch('https://localhost:7084/api/Categories/categories');
    const categories = await response.json();

    const categorySelect = document.getElementById('productCategory');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryID;
        option.textContent = category.categoryName;
        categorySelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', loadCategories);
document.getElementById('addProductForm').addEventListener('submit', async function(event) {
    debugger
    event.preventDefault();
debugger
var form=document.getElementById('addProductForm');
    const formData = new FormData(form);
    
    try {
        debugger
        const response = await fetch('https://localhost:7084/api/Products', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            debugger
            alert('Product added successfully');
            document.getElementById('addProductForm').reset();
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product');
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////
// Replace with your API endpoint URL
const apiUrl = 'https://localhost:7084/api/Products/all';

// Function to fetch products from the API
async function fetchProducts() {
    debugger
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        debugger
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to populate the product table
function displayProducts(products) {
    debugger
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    products.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.productID}</td>
            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewDetails(${product.productID})">Details</button>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${product.productID})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.productID})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
fetchProducts();