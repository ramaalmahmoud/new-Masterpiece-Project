async function fetchActivities() {
    try {
        // Fetch activities data from API
        const response = await fetch('https://localhost:7084/api/Activities/GetAllActivities');
        const activities = await response.json();

        // Render activities and categories
        renderActivities(activities);
        renderCategories(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

function renderActivities(activities) {
    const activitiesContainer = document.getElementById('activities-container');
    activitiesContainer.innerHTML = ''; // Clear previous content

    activities.forEach(activity => {
        const activityHTML = `
            <div class="col-xl-4 col-lg-4 col-md-6 services-two__single" data-category-id="${activity.categoryId}">
                <div class="services-two__img-box">
                    <div class="services-two__img">
                        <img src="${activity.imageUrl}" alt="${activity.title}">
                    </div>
                </div>
                <div class="services-two__content">
                    <div class="services-two__title-box">
                        <h3 class="services-two__title">
                            <a href="activity-details.html?id=${activity.id}">${activity.title}</a>
                        </h3>
                    </div>
                </div>
            </div>
        `;
        activitiesContainer.insertAdjacentHTML('beforeend', activityHTML);
    });
}
async function fetchCategories() {
    debugger
    try {
        // Fetch categories data from API
        const response = await fetch('https://localhost:7084/api/Activities/GetCategories');
        const categories = await response.json();
console.log("categories",categories)
        // Render categories checklists
        renderCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function renderCategories(categories) {
    debugger
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = ''; // Clear previous content

    // Render each category as a checkbox
    categories.forEach(category => {
        const categoryHTML = `
            <li>
                <input type="checkbox" id="category-${category.categoryId}" data-category-id="${category.categoryId}" class="category-checkbox">
                <label for="category-${category.categoryId}">${category.categoryName}</label>
            </li>`;
        categoriesList.insertAdjacentHTML('beforeend', categoryHTML);
    });
debugger
    // Add event listener for filtering based on selected checkboxes
    categoriesList.addEventListener('change', (e) => {
        const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
            .map(checkbox => checkbox.getAttribute('data-category-id'));
        filterActivitiesByCategory(selectedCategories);
    });
}

function filterActivitiesByCategory(selectedCategoryIds) {
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
}

// Call fetchCategories to fetch and display categories
fetchCategories();



// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activities = document.querySelectorAll('.services-two__single');
    activities.forEach(activity => {
        const title = activity.querySelector('.services-two__title a').innerText.toLowerCase();
        if (title.includes(searchTerm)) {
            activity.style.display = 'block';
        } else {
            activity.style.display = 'none';
        }
    });
});

// Call the function to fetch and display activities
fetchActivities();
//////////////////////////////////////////////////////////






