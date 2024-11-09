async function loadCategories() {
    const response = await fetch('https://localhost:7084/api/Categories/categories');
    const categories = await response.json();

    const categorySelect = document.getElementById('productCategory');
    const editcategorySelect = document.getElementById('EditproductCategory');

   

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryID;
            option.textContent = category.categoryName;
            categorySelect.appendChild(option);
        });
    
  
   
}
async function loadCategoriesforEdit() {
    const response = await fetch('https://localhost:7084/api/Categories/categories');
    const categories = await response.json();

    const categorySelect = document.getElementById('productCategory');
    const editcategorySelect = document.getElementById('EditproductCategory');

   

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryID;
            option.textContent = category.categoryName;
            editcategorySelect.appendChild(option);
        });
    
  
   
}
document.addEventListener('DOMContentLoaded', loadCategories);
document.addEventListener('DOMContentLoaded', loadCategoriesforEdit);
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
                        <td><img src="/Back End/master-piece-project/master-piece-project/Uploads/Shop/${product.image || 'default-pic.jpg'}" alt="Product" class="img-thumbnail" style="width: 50px;"></td>

            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${product.productID})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.productID})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
fetchProducts();

// Function to open the edit product form
async function editProduct(id) {
    localStorage.setItem("productId",id);
    try {
        const response = await fetch(`https://localhost:7084/api/Products/GetProductById/${id}`);
        const product = await response.json();

        // Fill in the edit form with product details
        document.getElementById('editProductId').value = product.productID;
        document.getElementById('editProductTitle').value = product.title;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stock;

        // Show the edit modal (if using Bootstrap)
        $('#editProductModal').modal('show');
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to update the product
async function updateProduct() {
    debugger
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);
    const id = localStorage.getItem("productId")

    try {
        const response = await fetch(`https://localhost:7084/api/Products/edit/${id}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            alert('Product updated successfully');
            fetchProducts(); // Refresh the products list
            $('#editProductModal').modal('hide'); // Close the modal
        } else {
            alert('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// Function to delete a product with confirmation
async function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return; // If user cancels the deletion, exit

    try {
        const response = await fetch(`https://localhost:7084/api/Products/delete/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Product deleted successfully');
            fetchProducts(); // Refresh the products list
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

