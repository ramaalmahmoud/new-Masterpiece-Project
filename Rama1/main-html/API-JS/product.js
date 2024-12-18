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

document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const searchTerm = document.getElementById('search-input').value;
    await searchProducts(searchTerm); // Fetch products with the search term
});

async function searchProducts(searchTerm) {
    
    try {
        // Encode the search term to ensure it's safe for use in a URL
        const encodedSearchTerm = encodeURIComponent(searchTerm);

        // Fetch the search results from the server
        const response = await fetch(`https://localhost:7084/api/products/search?query=${encodedSearchTerm}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error searching products:', error);
    }
}
document.getElementById('apply-filter').addEventListener('click', function() {
    debugger
    // Get the min and max price values from the input fields
    let minPrice = document.getElementById('min-price').value;
    let maxPrice = document.getElementById('max-price').value;

    // Remove any non-numeric characters (e.g., currency symbols)
    minPrice = minPrice.replace(/[^0-9.]/g, '');
    maxPrice = maxPrice.replace(/[^0-9.]/g, '');

    // Convert to numbers
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    // Check if the parsed values are valid numbers
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filterProducts(minPrice, maxPrice);
    } else {
        console.error('Invalid price range');
    }
});

async function filterProducts(minPrice, maxPrice) {
    debugger
    try {
        // Fetch the filtered products from the server
        const response = await fetch(`https://localhost:7084/api/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

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
                            <img src="../Back End/master-piece-project/master-piece-project/Uploads/Shop/${product.image}" alt="${product.title}">
                        </div>
                        <div class="product__all-content">
                            <div class="product__all-review">
                                ${renderStars(product.stars)}
                            </div>
                            <h4 class="product__all-title"><a href="product-details.html?id=${product.productId}">${product.title}</a></h4>
                            <p class="product__all-price">$${product.price}</p>
                            <div class="product__all-btn-box">
                                <a href="cart.html" class="thm-btn product__all-btn" onclick="saveProductId(${product.productID})">Add to Cart</a>
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
              // Assuming this stock level data comes from your backend
       const stockLevel = product.stock;  // You should dynamically fetch this value from your server for the product
       const addToCartButton = document.getElementById("addToCartbtn1");
    
   
       // Check if the product is in stock
       if (stockLevel <= 0) {
           // If out of stock, update the button
         // If in stock, show the normal Add to Cart button
         addToCartButton.innerHTML = `<button class="btn btn-danger" disabled>Out of Stock</button>`;
   
          
       }
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
                                        <img src="../Back End/master-piece-project/master-piece-project/Uploads/Shop/${product.image}" alt="${product.title}">
                                    </div>
                                    <div class="product__all-content">
                                        <div class="product__all-review">
                                            ${renderStars(product.stars)}
                                        </div>
                                        <h4 class="product__all-title"><a href="product-details.html?id=${product.productID}">${product.title}</a></h4>
                                        <p class="product__all-price">$${product.price}</p>
                                      <!-- All Products Page Button -->
<div class="product__all-btn-box" id="addToCartbtn1">
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
                    // Assuming this stock level data comes from your backend
       const stockLevel = product.stock;  // You should dynamically fetch this value from your server for the product
       const addToCartButton = document.getElementById("addToCartbtn1");
    
   
       // Check if the product is in stock
       if (stockLevel <= 0) {
           // If out of stock, update the button
         // If in stock, show the normal Add to Cart button
         addToCartButton.innerHTML = `<button class="btn btn-danger" disabled>Out of Stock</button>`;
   
          
       }
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
        console.log(product)

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to display product details on the page
function displayProductDetails(product) {

     
    debugger
    document.querySelector('.product-details__img img').src =`../Back End/master-piece-project/master-piece-project/Uploads/Shop/${product.image}`;
    document.querySelector('.product-details__title').innerHTML = `${product.title} <span>$${product.price}</span>`;
    // document.querySelector('.product-details__reveiw span').textContent = `${product.reviewsCount} customer reviews`;
    document.querySelector('.product-details__content-text1').textContent = product.description;
    document.getElementById("addToCartbtn").innerHTML=`    <a href="#" class="thm-btn" data-product-id="1" onclick="saveProductId(${product.productId})" >Add to Cart</a>`
debugger
    // Adjust stars based on product rating
    const starsContainer = document.querySelector('.product-details__reveiw');
    debugger
    debugger
    for (let i = 0; i < product.stars; i++) {
        starsContainer.innerHTML += '<i class="fa fa-star"></i>';
    }
    starsContainer.innerHTML += `<span>${product.reviewCount} customer reviews</span>`;
       // Assuming this stock level data comes from your backend
       const stockLevel = product.stock;  // You should dynamically fetch this value from your server for the product
       const addToCartButton = document.getElementById("addToCartbtn");
       const quantityInput = document.getElementById("quantity");
       const btnSub=document.getElementById("btnSub")
       const btnAdd=document.getElementById("btnAdd")
   
       // Check if the product is in stock
       if (stockLevel <= 0) {
           // If out of stock, update the button
           addToCartButton.innerHTML = '<button class="btn btn-danger" disabled>Out of Stock</button>';
           quantityInput.disabled = true;  // Disable quantity input when out of stock
           btnSub.disabled=true
           btnAdd.disabled=true
       } else {
           // If in stock, show the normal Add to Cart button
           addToCartButton.innerHTML = `<a href="#" class="thm-btn" data-product-id="1" onclick="saveProductId(${product.productId})" >Add to Cart</a>`;
   
          
       }
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

    // Get the UserID and ProductID from localStorage
    const userId = sessionStorage.getItem('UserID'); // Assuming these are stored in localStorage
    

    // Create a FormData object from the form
    const formData = new FormData(reviewForm);

    // Append the UserID and ProductID to the FormData
    formData.append('UserId', userId);
    formData.append('ProductID', productId);
    formData.append('Rating', selectedRating); // Use selectedRating variable from the form

    // Make a fetch call to your API endpoint
    const response = await fetch('https://localhost:7084/api/Reviews/PostReview', {
        method: 'POST',
        body: formData,
    });

    // Handle the response from the server
    const result = await response.json();

    console.log("Response:", result); // Log the response

    if (response.ok) {
        // Success alert with SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Review submitted successfully!',
            text: result.message, // Use the message from the backend
        });
    } else {
        // Error alert with SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message, // Use the message from the backend
        });
    }
});



////////////////////////////////////////////////////////////
// Add to cart function
async function addToCart(productId) {
    debugger
    const userId = sessionStorage.getItem("UserID"); // Get the user ID from session storage

    const quantityInput = document.getElementById("quantity"); // Get the quantity input element
    let quantity = quantityInput ? parseInt(quantityInput.value) : 1; // Default to 1 if the input is empty or invalid

    if (isNaN(quantity) || quantity <= 0) {
        quantity = 1; // Set default quantity to 1 if invalid
    }

    const url = 'https://localhost:7084/api/Cart/AddToCart'; // Adjust the URL to match your API endpoint
    const payload = {
        ProductId: productId,
        Quantity: quantity, // Use the quantity from the input
        UserId: userId
    };

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
    sessionStorage.ProductId=pId
    const productId= sessionStorage.getItem("ProductId");
    addToCart(productId); 
}


async function fetchReviews(productId) {
    try {
        // Fetch the reviews from the server
        const response = await fetch(`https://localhost:7084/api/Reviews/Reviews/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewsCount = document.getElementById('reviews-count');

    // Update reviews count
    reviewsCount.textContent = `${reviews.length} Reviews`;

    // Clear existing content
    reviewsContainer.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('comment-box');

        reviewElement.innerHTML = `
            <div class="comment">
                <div class="author-thumb">
                    <figure class="thumb"><img src="${review.userPicture}" alt="User Picture"></figure>
                </div>
                <div class="review-one__content">
                    <div class="review-one__content-top">
                        <div class="info">
                            <h2>${review.userName} <span>${new Date(review.createdAt).toLocaleDateString()} . ${new Date(review.createdAt).toLocaleTimeString()}</span></h2>
                        </div>
                        <div class="reply-btn">
                            ${generateStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-one__content-bottom">
                        <p>${review.comment}</p>
                    </div>
                </div>
            </div>
        `;

        reviewsContainer.appendChild(reviewElement);
    });
}

function generateStars(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starsHtml += '<i class="fa fa-star"></i>';
        } else {
            starsHtml += '<i class="fa fa-star-o"></i>'; // For empty stars
        }
    }
    return starsHtml;
}

// Example usage: fetch reviews for a post with ID 1
fetchReviews(productId);
