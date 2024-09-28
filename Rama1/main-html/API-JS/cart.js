// Fetch Cart Items
async function fetchCartItems() {
    debugger
    const userId = localStorage.getItem("UserID");
    debugger
    try {
      const response = await fetch(`https://localhost:7084/api/Cart/GetCartByUserId/${userId}`); // Adjust with your API endpoint
      const cartData = await response.json();
      debugger
      const { cartItems } = cartData;
  console.log(cartItems)
      renderCartItems(cartItems);
      updateCartSummary(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }
  
  // Render Cart Items
  function renderCartItems(cartItems) {
    debugger
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
  
    cartItems.forEach((item) => {
      cartItemsContainer.innerHTML += `
        <tr data-product-id="${item.productId}">
          <td>
            <div class="product-box">
              <div class="img-box">
                <img src="${item.productImage}" alt="${item.productName}">
              </div>
              <h3><a href="product-details.html">${item.productName}</a></h3>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="quantity-box">
              <button type="button" class="sub" onclick="updateQuantity(${item.cartItemId}, -1)"><i class="fa fa-minus"></i></button>
              <input type="number" id="product-${item.cartItemId}" value="${item.quantity}" min="1" />
              <button type="button" class="add" onclick="updateQuantity(${item.cartItemId}, 1)"><i class="fa fa-plus"></i></button>
            </div>
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <div class="cross-icon">
              <i class="fas fa-times remove-icon" onclick="removeItem(${item.cartItemId})"></i>
            </div>
          </td>
        </tr>`;
    });
  }
  
  // Update Quantity
  async function updateQuantity(cartItemId, change) {
    debugger
    const quantityInput = document.getElementById(`product-${cartItemId}`);
    let newQuantity = parseInt(quantityInput.value) + change;
  debugger
    if (newQuantity < 1) {
      newQuantity = 1; // Minimum quantity is 1
    }
  debugger
    quantityInput.value = newQuantity; // Update the input field with the new quantity
  
    try {
      await fetch(`https://localhost:7084/api/Cart/UpdateCartItem/${cartItemId}`, {
        method: 'PUT', // Use PUT method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newQuantity }), // Send the new quantity as an object
      });
  
    //   await fetchCartItems(); // Re-fetch cart items to reflect updates
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }
  
  // Remove Item
  async function removeItem(cartItemId) {
    debugger
    try {
      await fetch(`https://localhost:7084/api/Cart/DeleteCartItem/${cartItemId}`, { // Adjust endpoint as necessary
        method: 'DELETE',
      });
  
      fetchCartItems(); // Re-fetch cart items
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
  
  // Update Cart Summary
  function updateCartSummary(cartItems) {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = 0; // Assuming free shipping for now
    const totalAmount = subtotal + shippingCost;
  
    document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)} USD`;
    document.getElementById('shipping-cost').innerText = `$${shippingCost.toFixed(2)} USD`;
    document.getElementById('total-amount').innerText = `$${totalAmount.toFixed(2)} USD`;
  }
  
  // Initialize Cart
  document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
  
    // Handle coupon form submission
    document.getElementById('apply-coupon').addEventListener('click', (e) => {
      e.preventDefault();
      const couponCode = document.getElementById('coupon-code').value;
      applyCoupon(couponCode);
    });
  
    // Handle cart update
    document.getElementById('update-cart').addEventListener('click', (e) => {
      e.preventDefault();
      fetchCartItems(); // Re-fetch cart items after update
    });
  });
  
  // Apply Coupon (optional)
  async function applyCoupon(couponCode) {
    try {
      const response = await fetch('https://api.example.com/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode }),
      });
      const data = await response.json();
  
      if (data.success) {
        fetchCartItems(); // Refresh cart after coupon is applied
      } else {
        alert('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  }
  