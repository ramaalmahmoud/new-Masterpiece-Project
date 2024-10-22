// document.getElementById('place-order-button').addEventListener('click', async function (event) {
//     event.preventDefault(); // Prevent the default form submission
// debugger
//     // Collect form data
//     const shippingAddress = document.querySelector('input[name="Address"]').value;
//     const email = document.querySelector('input[name="email"]').value;
//     const phone = document.querySelector('input[name="form_phone"]').value;
//     const orderNotes = document.querySelector('textarea[name="form_order_notes"]').value;
    
//     // Example: These should be product IDs from the shopping cart
//     const products = [1, 2, 3]; // Replace with actual product IDs
//     debugger
//     const orderData = {
//         UserId: 1, // Replace with the actual user ID (maybe from a logged-in session)
//         OrderStatus: "Pending",
//         OrderDate: new Date().toISOString(),
//         ShippingAddress: shippingAddress,
//         Products: products,
//         TotalAmount: 20.98 // Replace with the actual total amount
//     };

//     // Send the order to your backend API
//     try {
//         debugger
//         const orderResponse = await fetch('https://localhost:7084/api/Orders/createOrderAPI', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(orderData)
//         });

//         if (!orderResponse.ok) {
//             throw new Error('Error creating order');
//         }
// debugger
//         const orderResult = await orderResponse.json();
//         console.log('Order created successfully:', orderResult);

//         // Check if the user selected PayPal payment method
//         const paypalSelected = document.querySelector('.checkout__payment__item--active').innerText.includes('Paypal');
//         if (paypalSelected) {
//             // Trigger PayPal payment
//             await initiatePayPalPayment(orderData.TotalAmount);
//         } else {
//             alert('Order placed successfully with Cash on Delivery');
//         }

//     } catch (error) {
//         console.error('Error:', error);
//     }
// });

// // Function to initiate PayPal payment
// async function initiatePayPalPayment(amount) {


//     debugger
//     try {
//         // Call your PayPal create order API
//         const createOrderResponse = await fetch('https://localhost:7084/api/Payments/create-order', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(amount) // Pass the amount to PayPal API
//         });

//         if (!createOrderResponse.ok) {
//             throw new Error('Error creating PayPal order');
//         }

//         const orderData = await createOrderResponse.json();
//         const orderId = orderData.id; // Assuming your API returns an order ID

//         // Capture PayPal payment
//         const captureResponse = await fetch(`https://localhost:7084/api/Payments/capture-order/${orderId}`, {
//             method: 'POST'
//         });

//         if (!captureResponse.ok) {
//             throw new Error('Error capturing PayPal payment');
//         }

//         const captureResult = await captureResponse.json();
//         alert('Payment captured successfully. Your order is complete!');
//     } catch (error) {
//         console.error('PayPal payment error:', error);
//     }
// }

// جلب المجموع الإجمالي من الـ API وعرضه في ملخص الطلب
// async function fetchCartTotal(userId) {
//     debugger
//     try {
//         // استدعاء API لجلب المجموع الكلي لسلة المشتريات
//         const response = await fetch(`https://localhost:7084/api/Orders/get-cart-total/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//             // ارجع المجموع الكلي
//             return data.totalAmount;
//         } else {
//             console.error("Failed to fetch cart total:", data.message);
//         }
//     } catch (error) {
//         console.error("Error fetching cart total:", error);
//     }
// }
// document.addEventListener('DOMContentLoaded', async function () {
//     debugger
//     const userId = 16; // استبدل هذا برقم المستخدم الحقيقي
//     const totalAmount = await fetchCartTotal(userId);
//     debugger
//     // تحديث جدول الطلبات في الـ frontend
//     document.querySelector('.pro__price.subtotal').textContent = `$${totalAmount} USD`;
//     document.querySelector('#paypal-button-container').style.display = 'block'; // عرض زر PayPal
// });


// function loadPayPalButton(totalAmount) {
//     debugger
//     paypal.Buttons({
//         createOrder: function (data, actions) {
//             return actions.order.create({
//                 purchase_units: [{
//                     amount: {
//                         value: totalAmount.toFixed(2) // هنا نستخدم المجموع الديناميكي
//                     }
//                 }]
//             });
//         },
//         onApprove: function (data, actions) {
//             return actions.order.capture().then(function (details) {
//                 alert('Transaction completed by ' + details.payer.name.given_name);
//                 window.location.href = '/order-success';
//             });
//         }
//     }).render('#paypal-button-container');
// }

