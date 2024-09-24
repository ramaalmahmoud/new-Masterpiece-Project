// async function addVolunteer(event) {
//     debugger
//     event.preventDefault(); // لمنع إعادة تحميل الصفحة عند الضغط على زر الإرسال

//     // تحديد عنوان الـ API الذي سيتم إرسال البيانات إليه
//     const url = "https://localhost:7084/api/User/addVolunteer";

//     // الحصول على النموذج
//     const form = document.getElementById("volunteer-form");
    
//     // جمع البيانات باستخدام FormData
//     const formData = new FormData(form);

//     try {
//         // إرسال البيانات إلى الـ API باستخدام fetch
//         const response = await fetch(url, {
//             method: 'POST', // إرسال البيانات باستخدام POST
//             body: formData // إرسال بيانات النموذج
//         });

//         // التحقق من الاستجابة
//         if (response.ok) {
//             // إذا كان الطلب ناجحًا
//             const result = await response.json();
//             alert("Data has been successfully stored!");
//             console.log(result);
//         } else {
//             // إذا كان هناك خطأ في الاستجابة
//             const errorData = await response.json();
//             alert("Error occurred while storing data: " + JSON.stringify(errorData));
//         }
//     } catch (error) {
//         // التعامل مع أي خطأ يحدث أثناء العملية
//         console.error("Error: ", error);
//         alert("An error occurred: " + error.message);
//     }
// }

// debugger
// async function fetchUserInfo() {
//     const token = localStorage.getItem('jwtToken');

//     debugger
//     try {
//         const response = await fetch('https://localhost:7084/api/Appointment/user-info', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}` // Send the token in the Authorization header
//             }
//         });
       
//         if (!response.ok) {
//             throw new Error('Failed to fetch user info');
//         }

//         const user = await response.json();
        
//         // Populate the form with user information
//         document.querySelector('input[name="F-name"]').value = user.fullName.split(' ')[0]; // First Name
//         document.querySelector('input[name="L-name"]').value = user.fullName.split(' ')[1]; // Last Name
//         document.querySelector('input[name="email"]').value = user.email; // Email
//         document.querySelector('input[name="Phone"]').value = user.phoneNumber; // Phone Number

//     } catch (error) {
//         console.error('Error fetching user info:', error);
//     }
// }


debugger
async function fetchDoctors() {
  

    debugger
    try {
        const response = await fetch('https://localhost:7084/api/Appointment/getDoctors');
        const doctors = await response.json();
        const doctorSelect = document.getElementById('doctorId');
        debugger
        doctors.forEach(doctor => {
            debugger
            const option = document.createElement('option');
            option.value = doctor.doctorId;
            option.textContent = doctor.fullName; // Use FullName from the API response
            doctorSelect.appendChild(option);
        });
     
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
    
}


// async function submitAppointmentForm() {
//     const form = document.getElementById('appointment-form');
//     const formData = new FormData(form);
    
//     const appointmentData = {
//         FirstName: formData.get('F-name'),
//         LastName: formData.get('L-name'),
//         Email: formData.get('email'),
//         Phone: formData.get('Phone'),
//         ProgramId: formData.get('program'),
//         DoctorId: formData.get('doctor'),
//         AppointmentDate: new Date(formData.get('date')).toISOString(),
//         SessionType: formData.get('sessionType'),
//         Message: formData.get('message')
//     };

//     try {
//         const response = await fetch('/api/appointment/book', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(appointmentData)
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Error: ${errorText}`);
//         }

//         const result = await response.json();
//         console.log('Appointment booked successfully:', result);
//         // Optionally, display a success message to the user

//     } catch (error) {
//         console.error('Failed to book appointment:', error);
//         // Optionally, display an error message to the user
//     }
// }

// Attach the submit function to the form's submit event
// document.getElementById('appointment-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the default form submission
//     submitAppointmentForm();
// });

// Fetch user info, programs, and doctors when the page loads
document.addEventListener('DOMContentLoaded', () => {
    debugger
    // fetchUserInfo();
    // fetchPrograms();
    fetchDoctors();
});
