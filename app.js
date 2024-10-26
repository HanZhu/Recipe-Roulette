const API_KEY = 'df2ed0641ec34a45a405edfacfeb5650';
const API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

const ingredientsInput = document.getElementById('ingredients');
const generateButton = document.getElementById('generate-recipe');
const recipeDisplay = document.getElementById('recipe-display');
const recipeTitle = document.getElementById('recipe-title');
const recipeImage = document.getElementById('recipe-image');
const cookingTime = document.getElementById('cooking-time');
const ingredientsList = document.getElementById('ingredients-list');
const instructionsList = document.getElementById('instructions-list');
const ingredientTiles = document.querySelectorAll('.ingredient-tile.clickable');

document.addEventListener('DOMContentLoaded', function() {
    generateButton.addEventListener('click', generateRecipe);

    // Add click event listeners to ingredient tiles
    ingredientTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const ingredientText = tile.textContent.split(' ').slice(1).join(' '); // Remove emoji
            addIngredientToInput(ingredientText);
        });
    });

    const tryAnotherButton = document.getElementById('try-another-recipe');
    tryAnotherButton.addEventListener('click', generateRecipe);

    function addIngredientToInput(ingredient) {
        const currentIngredients = ingredientsInput.value.trim();
        if (currentIngredients) {
            ingredientsInput.value = currentIngredients + ', ' + ingredient;
        } else {
            ingredientsInput.value = ingredient;
        }
    }

    async function generateRecipe() {
        const ingredients = ingredientsInput.value.trim();
        if (!ingredients) {
            alert('Please enter some ingredients');
            return;
        }

        try {
            const recipes = await fetchRecipes(ingredients);
            if (recipes.length === 0) {
                alert('No recipes found for the given ingredients');
                return;
            }

            const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
            const recipeDetails = await fetchRecipeDetails(randomRecipe.id);
            displayRecipe(randomRecipe, recipeDetails);
        } catch (error) {
            console.error('Error generating recipe:', error);
            alert('An error occurred while generating the recipe. Please try again.');
        }
    }

    async function fetchRecipes(ingredients) {
        const response = await fetch(`${API_URL}?apiKey=${API_KEY}&ingredients=${ingredients}&number=10&ranking=1`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        return response.json();
    }

    async function fetchRecipeDetails(recipeId) {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipe details');
        }
        return response.json();
    }

    function displayRecipe(recipe, recipeDetails) {
        recipeTitle.textContent = recipe.title;
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.title;
        cookingTime.textContent = `Cooking Time: ${recipeDetails.readyInMinutes} minutes`;

        ingredientsList.innerHTML = '';
        recipe.usedIngredients.concat(recipe.missedIngredients).forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient.original;
            ingredientsList.appendChild(li);
        });

        instructionsList.innerHTML = '';
        recipeDetails.analyzedInstructions[0].steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.step;
            instructionsList.appendChild(li);
        });

        recipeDisplay.classList.remove('hidden');
    }

    // Create Buy Me a Coffee button if it doesn't exist
    if (!document.getElementById('bmc-button')) {
        const bmcButton = document.createElement('a');
        bmcButton.id = 'bmc-button';
        bmcButton.className = 'bmc-button';
        bmcButton.href = 'https://buymeacoffee.com/hannawandering';
        bmcButton.target = '_blank';
        bmcButton.innerHTML = `
            <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee">
            <span>Buy me a coffee</span>
        `;
        document.body.appendChild(bmcButton);
    }

    // Buy Me a Coffee button animation
    const bmcButton = document.getElementById('bmc-button');
    
    function animateButton() {
        bmcButton.classList.add('animate');
        setTimeout(() => {
            bmcButton.classList.remove('animate');
        }, 1000);
    }

    // Animate every 5 seconds
    setInterval(animateButton, 5000);

    // Animate on hover
    bmcButton.addEventListener('mouseenter', animateButton);
});
