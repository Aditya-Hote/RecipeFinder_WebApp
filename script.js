
document.addEventListener('DOMContentLoaded', () => {
    loadDefaultRecipes();
});

function loadDefaultRecipes() {
    fetchRecipes('https://www.themealdb.com/api/json/v1/1/search.php?s=');
}

function findRecipe() {
    const recipeName = document.getElementById('recipeInput').value;
    if (recipeName) {
        fetchRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
    } else {
        loadDefaultRecipes();
    }
}

function fetchRecipes(apiUrl) {
    const container = document.getElementById('recipeContainer');
    container.innerHTML = '';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                data.meals.forEach(meal => {
                    if (meal.strMealThumb) {
                        const recipeCard = `
                            <div class="recipe-card" onclick="showRecipeDetails('${meal.idMeal}')">
                                <h2>${meal.strMeal}</h2>
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                <p><strong>Instructions:</strong> ${meal.strInstructions ? meal.strInstructions.substring(0, 150) : 'No instructions available'}...</p>
                            </div>
                        `;
                        container.innerHTML += recipeCard;
                    }
                });
            } else {
                container.innerHTML = '<p>No recipes found. Please try again.</p>';
            }
        })
        .catch(error => {
            container.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
            console.error('Error:', error);
        });
}

function showRecipeDetails(recipeId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const modal = document.getElementById('recipeModal');
            const recipeTitle = document.getElementById('recipeTitle');
            const recipeImage = document.getElementById('recipeImage');
            const ingredientList = document.getElementById('ingredientList');
            const recipeInstructions = document.getElementById('recipeInstructions');

            modal.style.display = 'block';
            recipeTitle.innerHTML = meal.strMeal;
            recipeImage.src = meal.strMealThumb;

            // Ingredients
            ingredientList.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                if (ingredient) {
                    const listItem = document.createElement('li');
                    listItem.textContent = ingredient;
                    ingredientList.appendChild(listItem);
                }
            }

            // Instructions
            recipeInstructions.textContent = meal.strInstructions;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function closeModal() {
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'none';
}