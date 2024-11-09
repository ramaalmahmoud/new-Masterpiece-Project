

let materialCount = 1;
let instructionCount = 1;

// Add Material Button Click Event
document.getElementById('addMaterialButton').addEventListener('click', function() {
const materialsContainer = document.getElementById('materialsContainer');
const newMaterial = document.createElement('div');
newMaterial.classList.add('material');
newMaterial.innerHTML = `
    <input type="text" name="Materials[${materialCount}].Name" class="form-control mb-2" placeholder="Enter material name">
`;
materialsContainer.appendChild(newMaterial);
materialCount++;
});

// Add Instruction Button Click Event
document.getElementById('addInstructionButton').addEventListener('click', function() {
const instructionsContainer = document.getElementById('instructionsContainer');
const newInstruction = document.createElement('div');
newInstruction.classList.add('instruction');
newInstruction.innerHTML = `
    <div class="form-group">
        <label for="instructionDetails${instructionCount}">Step ${instructionCount + 1} Instructions</label>
        <textarea class="form-control" name="Instructions[${instructionCount}].InstructionText" rows="2" placeholder="Enter step instructions"></textarea>
    </div>
    <div class="form-group">
        <label for="instructionImage${instructionCount}">Step ${instructionCount + 1} Image</label>
        <input type="file" name="Instructions[${instructionCount}].ImageUrl" class="form-control-file">
    </div>
`;
instructionsContainer.appendChild(newInstruction);
instructionCount++;
});

// Fetch and Populate Categories
function loadCategories() {
debugger
fetch('https://localhost:7084/api/Activities/get-activityCategory') // Adjust API endpoint for fetching categories
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById('activityCategory');
        categorySelect.innerHTML = ''; // Clear existing options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.categoryName;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));
}

// Call loadCategories on page load
document.addEventListener('DOMContentLoaded', loadCategories);

// Handle Category Form Submission
document.getElementById('categoryForm').addEventListener('submit', function(e) {
debugger
e.preventDefault(); // Prevent default form submission

// const categoryName = document.getElementById('categoryName').value;
var form=document.getElementById("categoryForm");
const formdata=new FormData(form);

fetch('https://localhost:7084/api/Activities/add-category', { // Adjust API endpoint for adding categories
    method: 'POST',
    
    // body: JSON.stringify({ name: categoryName })
    body: formdata
})
.then(response => response.json())
.then(data => {
    alert(data.message);
    loadCategories(); // Reload categories after adding a new one
    document.getElementById('categoryForm').reset();
})
.catch(error => console.error('Error adding category:', error));
});

// Handle Activity Form Submission
document.getElementById('activityForm').addEventListener('submit', function(e) {
debugger
e.preventDefault(); // Prevent default form submission

const form = document.getElementById('activityForm');
const formData = new FormData(form); // Collect all form data, including files

fetch('https://localhost:7084/api/Activities/add-activity', { // Adjust API endpoint for adding activities
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
  debugger
    if (data.message) {
        alert(data.message); // Show success message
        form.reset(); // Reset form after submission
        materialCount = 1; // Reset material counter
        instructionCount = 1; // Reset instruction counter
    }
debugger })
.catch(error => console.error('Error adding activity:', error));
});



// Fetch activities and populate the table
async function fetchActivities() {
    const response = await fetch('https://localhost:7084/api/Activities/get-activities');
    const activities = await response.json();

    const tbody = document.getElementById('activityTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="/Back End/master-piece-project/master-piece-project/Uploads/Activity/${activity.image || 'default-pic.jpg'}" alt="Profile" class="img-thumbnail" style="width: 50px;"></td>
            <td>${activity.title}</td>
            <td>${activity.categoryName}</td>
            <td>${activity.duration}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-activity-btn"data-bs-toggle="modal" data-bs-target="#updateActivityModal" data-activity-id="${activity.activityId}">Edit</button>
                <a href="#" class="btn btn-danger btn-sm delete-activity-btn" onclick="confirmDelete(${activity.activityId})">Delete</a>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachEditButtons();
}

// Call fetchActivities on page load
document.addEventListener('DOMContentLoaded', fetchActivities);

// Attach event listeners to edit buttons
function attachEditButtons() {
    document.querySelectorAll('.edit-activity-btn').forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const activityId = this.getAttribute('data-activity-id');

            await openUpdateForm(activityId);

        });
    });
}

// Function to load activity details and populate the update form
async function openUpdateForm(activityId) {
    try {
        const response = await fetch(`https://localhost:7084/api/Activities/GetActivityWithDetails/${activityId}`);
        const activity = await response.json();

        // Populate form fields with activity data
        document.getElementById('activityId').value = activityId;
        document.getElementById('activityTitle').value = activity.title;
        document.getElementById('activityDuration').value = activity.duration;
        document.getElementById('suggestions').value = activity.suggestions;
        document.getElementById('activityCategory').value = activity.categoryId;

        // Populate materials and instructions
        populateMaterials(activity.materials);
        populateInstructions(activity.instructions);

        // Open the update activity modal
        var updateActivityModal = new bootstrap.Modal(document.getElementById('updateActivityModal'));
        updateActivityModal.show();
    } catch (error) {
        console.error('Error loading activity details:', error);
    }
}

// Function to populate materials dynamically in the form
function populateMaterials(materials) {
    const materialsContainer = document.getElementById('materialsContainer');
    materialsContainer.innerHTML = ''; // Clear existing materials

    materials.forEach((material, index) => {
        const materialHTML = `
            <div class="material mb-2">
                <input type="text" name="Materials[${index}].Name" class="form-control" value="${material}" required>
            </div>`;
        materialsContainer.insertAdjacentHTML('beforeend', materialHTML);
    });
}

// Function to populate instructions dynamically in the form
function populateInstructions(instructions) {
    const instructionsContainer = document.getElementById('instructionsContainer');
    instructionsContainer.innerHTML = ''; // Clear existing instructions

    instructions.forEach((instruction, index) => {
        const instructionHTML = `
            <div class="instruction mb-3">
                <div class="form-group">
                    <label>Step ${index + 1}</label>
                    <textarea name="Instructions[${index}].InstructionText" class="form-control mb-2" rows="2" required>${instruction.instructionText}</textarea>
                    <input type="file" name="Instructions[${index}].ImageUrl" class="form-control-file">
                </div>
            </div>`;
        instructionsContainer.insertAdjacentHTML('beforeend', instructionHTML);
    });
}
// Function to handle delete with confirmation
function confirmDelete(activityId) {
    // Show confirmation dialog
    const isConfirmed = confirm("Are you sure you want to delete this activity? This action cannot be undone.");
    
    if (isConfirmed) {
        deleteActivity(activityId);
        fetchActivities();

    }
}

// Function to handle the actual deletion (API call or removal from DOM)
function deleteActivity(activityId) {
    // Perform the deletion (API call to delete the activity on the server)
    fetch(`https://localhost:7084/api/Activities/DeleteActivity/${activityId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // Include any authorization headers if needed
        }
    })
    .then(response => {
        if (response.ok) {
            // Remove the activity row from the table after successful deletion
            const activityRow = document.getElementById(`activity-${activityId}`);
            if (activityRow) {
                activityRow.remove();
            }
        } else {
            alert('Error deleting activity');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the activity.');
    });
}

