document.addEventListener("DOMContentLoaded", () => {
    // Fetch categories
    fetchCategories();

    // Fetch products (initial load)
    fetchProducts();
debugger
 // Async function to fetch sorted products
// async function fetchSortedProducts(sortBy) {
//     debugger
//     try {
//         // Construct the API endpoint based on the sort criteria
//         const response = await fetch(`https://localhost:7084/api/Products/sort?sortBy=${sortBy}`);
        
//         if (!response.ok) {
//             throw new Error('Error fetching sorted products');
//         }
        
//         const products = await response.json();

//         // Assuming you have a function to display products
//         displayProducts(products);

//     } catch (error) {
//         console.error('Error fetching sorted products:', error);
//     }
// }
debugger
// document.getElementById('sort-by').addEventListener('change', (e) => {
//     debugger
//     const sortBy = Number(e.target.value); // Get the selected sorting option
//     fetchSortedProducts(sortBy);   // Fetch sorted products based on the selected option
// });

// Function to display products (You can modify this function based on your page structure)
function displayProducts(products) {
    debugger
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing products

    // Iterate over the keys of the products object
    Object.keys(products).forEach(key => {
        const product = products[key]; // Access product using key
        const productHtml = `
            <div class="col-xl-4 col-lg-4 col-md-6">
                <div class="product__all-single">
                    <div class="product__all-single-inner">
                        <div class="product__all-img">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="product__all-content">
                            <div class="product__all-review">
                                ${renderStars(product.stars)}
                            </div>
                            <h4 class="product__all-title"><a href="product-details.html?id=${product.productId}">${product.title}</a></h4>
                            <p class="product__all-price">$${product.price}</p>
                            <div class="product__all-btn-box">
                                <a href="cart.html" class="thm-btn product__all-btn">Add to Cart</a>
                            </div>
                        </div>
                        <div class="products__all-icon-boxes">
                            <a href="#"><i class="far fa-heart"></i></a>
                            <a href="#"><i class="fas fa-eye"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productList.insertAdjacentHTML('beforeend', productHtml);
    });
}


// Keep track of selected category IDs
let selectedCategories = [];

// Fetch categories from API
async function fetchCategories() {
    debugger
    try {
        const response = await fetch('https://localhost:7084/api/Categories/categories'); // Replace with your API URL
        const categories = await response.json();

        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = ''; // Clear existing categories

        categories.forEach(category => {
            const  categoryHTML = `
            <li>
                <input type="checkbox" id="category-${category.categoryID}" data-category-id="${category.categoryID}" class="category-checkbox">
                <label for="category-${category.categoryID}">${category.categoryName}</label>
            </li>`;
            categoryList.insertAdjacentHTML('beforeend', categoryHTML);

        });
        categoryList.addEventListener('change',(e)=>{
const selectedCategories=Array.from(document.querySelectorAll('.category-checkbox:checked'))
.map(checkbox=>checkbox.getAttribute('data-category-id'));
fetchProductsByCategories(selectedCategories);
        });
        // Add click event listeners for category filtering
        
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Example of fetching all products (without filtering)



    // Fetch products from API
  async  function fetchProducts() {
        debugger
        let apiUrl = `https://localhost:7084/api/Products/all`;  // Replace with your API URL
      

      await  fetch(apiUrl)
            .then(response =>  response.json())
            .then(products => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = ''; // Clear existing products

                products.forEach(product => {
                    const productHtml = `
                        <div class="col-xl-4 col-lg-4 col-md-6 services-two__single" data-category-id="${product.categoryID}" >
                            <div class="product__all-single">
                                <div class="product__all-single-inner">
                                    <div class="product__all-img">
                                        <img src="${product.image}" alt="${product.title}">
                                    </div>
                                    <div class="product__all-content">
                                        <div class="product__all-review">
                                            ${renderStars(product.stars)}
                                        </div>
                                        <h4 class="product__all-title"><a href="product-details.html?id=${product.productID}">${product.title}</a></h4>
                                        <p class="product__all-price">$${product.price}</p>
                                      <!-- All Products Page Button -->
<div class="product__all-btn-box">
    <a href="#" class="thm-btn product__all-btn" id="btn1" onclick="saveProductId(${product.productID})">Add to Cart</a>
</div>
                                    </div>
                                    <div class="products__all-icon-boxes">
                                        <a href="#"><i class="far fa-heart"></i></a>
                                        <a href="#"><i class="fas fa-eye"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    productList.insertAdjacentHTML('beforeend', productHtml);
                });

                // Update product count
                document.getElementById('product-count').textContent = `Showing ${products.length} Products`;
            })
            .catch(error => console.error('Error fetching products:', error));
    }
// Async function to fetch products by category IDs
async function fetchProductsByCategories(selectedCategoryIds) {
    const activities = document.querySelectorAll('.services-two__single');
    if (selectedCategoryIds.length === 0) {
        activities.forEach(activity => activity.style.display = 'block');
    } else {
        activities.forEach(activity => {
            const activityCategoryId = activity.getAttribute('data-category-id');
            if (selectedCategoryIds.includes(activityCategoryId)) {
                activity.style.display = 'block';
            } else {
                activity.style.display = 'none';
            }
        });
    }

    // debugger
    // const url =`https://localhost:7084/api/products/filterByCategories?${categoryIds.map(id => `categoryIds=${id}`).join('&')}`;

    // try {
    //     // Make the POST request with the category IDs in the query parameters
    //     debugger
    //     const response = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });

    //     // Check if the response is successful
    //     if (!response.ok) {
    //         throw new Error(`Error fetching products: ${response.statusText}`);
    //     }

    //     // Parse the JSON data
    //     const products = await response.json();

    //     // Handle the products data (e.g., update the UI)
    //     renderProducts(products);
    // } catch (error) {
    //     console.error('Error:', error);
    // }
}
    // Helper function to render stars
    function renderStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < rating ? '<i class="fa fa-star"></i>' : '<i class="fa fa-star-o"></i>';
        }
        return stars;
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//product details
// Function to fetch product details based on product ID
async function fetchProductDetails(productId) {
    debugger
    try {
        const response = await fetch(`https://localhost:7084/api/Products/GetProductById/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to display product details on the page
function displayProductDetails(product) {
    debugger
    document.querySelector('.product-details__img img').src = product.image;
    document.querySelector('.product-details__title').innerHTML = `${product.title} <span>$${product.price}</span>`;
    document.querySelector('.product-details__reveiw span').textContent = `${product.reviewsCount} customer reviews`;
    document.querySelector('.product-details__content-text1').textContent = product.description;
    document.querySelector('.product-details__content-text2').innerHTML = `REF. ${product.reference} <br> Available in store`;
debugger
    // Adjust stars based on product rating
    const starsContainer = document.querySelector('.product-details__reveiw');
    debugger
    starsContainer.innerHTML = '';
    debugger
    for (let i = 0; i < product.stars; i++) {
        starsContainer.innerHTML += '<i class="fa fa-star"></i>';
    }
    starsContainer.innerHTML += `<span>${product.reviewsCount} customer reviews</span>`;
}

// Assuming you are getting the productId from the URL parameters
debugger
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
debugger
// Fetch product details when the page loads
if (productId) {
    fetchProductDetails(productId);
}
//////////////////////////////////////////////////////////////////////////////////////////
// Function to handle rating stars
const stars = document.querySelectorAll('.review-form-one__rate i.fa-star');
const reviewForm = document.getElementById('reviewForm');
let selectedRating = 0; // Variable to keep track of the selected rating

// Add event listeners for stars
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1; // Update the selected rating based on clicked star

        // Update star appearance
        stars.forEach((s, i) => {
            s.classList.toggle('checked', i < selectedRating); // Mark stars as checked
        });
    });
});

// Handle form submission
reviewForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Create a FormData object from the form
    const formData = new FormData(reviewForm);

    // Append the selected rating to FormData
    formData.append('Rating', selectedRating); // Use selectedRating variable

    // Convert FormData to a plain object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Make a fetch call to your API endpoint (replace with your actual URL)
    const response = await fetch('https://localhost:7084/api/Reviews/PostReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Convert data to JSON
    });

    // Handle response
    if (response.ok) {
        const result = await response.json();
        document.querySelector('.result').textContent = 'Review submitted successfully!';
    } else {
        const error = await response.text();
        document.querySelector('.result').textContent = `Error: ${error}`;
    }
});

////////////////////////////////////////////////////////////
// add to cart 
debugger
async function addToCart(productId, quantity = 1) {
    debugger
    const userId = localStorage.getItem("UserID"); // Replace this with the actual logged-in user ID if applicable

    const url = 'https://localhost:7084/api/Cart/AddToCart'; // Adjust the URL to match your API endpoint
    const payload = {
        ProductId: productId,
        Quantity: quantity,
        UserId: userId
    };
debugger
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }
debugger
        const data = await response.json();
        console.log('Item added to cart successfully:', data);
        alert('Item added to cart successfully!');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Error adding item to cart. Please try again.');
    }
}
function saveProductId(pId){
    debugger
    localStorage.ProductId=pId
    const productId= localStorage.getItem("ProductId");
    addToCart(productId); 
}
