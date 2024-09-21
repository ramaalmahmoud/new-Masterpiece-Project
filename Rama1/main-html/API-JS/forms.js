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
