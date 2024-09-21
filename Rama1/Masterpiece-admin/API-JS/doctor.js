document.getElementById("add-doctor-form").addEventListener("submit", addDoctor);

async function addDoctor(event) {
    event.preventDefault(); // Prevent default form submission
    debugger;

    const url = "https://localhost:7084/api/User/addDoctors";
    var form = document.getElementById("add-doctor-form");
    var formData = new FormData(form);

    try {
        let response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            let errorData = await response.json();
            console.log('Error:', errorData);
            alert('Something went wrong: ' + JSON.stringify(errorData));
            return;
        }

        window.alert("You have successfully registered! Welcome aboard.");
        window.location.href = "volunteer.html";
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An unexpected error occurred.');
    }
}
