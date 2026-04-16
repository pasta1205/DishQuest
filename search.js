const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
/*const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");*/

// When form is submitted
if (searchForm) {
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault(); // stop page reload

    let searchTerm = searchInput.value.trim(); // get input

    if (searchTerm != "") {
      searchRecipes(searchTerm); // search dish
    } else {
      showMessage("Enter a dish name", true); // show error
    }
  });
}


//function to search recipes based on user query
async function searchRecipes(query) {

  showMessage('Searching for "${query}"...', false, true);
  clearResults();

  try {
    //API CALLING
    const data = await callGemini(promptForRecipeSearch(query));
    //getting response recipes
    const recipes = enrichRecipes(data.recipes || []);
    clearMessage();

    // receipes checking
    if (recipes.length > 0) {
      currentRecipes = recipes;

      //displaying recipes on the page
      displayRecipes(recipes);
    } 
    else {
      showMessage('No recipes found for "${query}".');
    }
  } 
    catch (error) {
    showMessage("Something went wrong. Please try again.", true);
  }
}

// Function to display all recipes on the page
function displayRecipes(recipes) {

  // removed old results
  resultsGrid.innerHTML = "";
  for (let i = 0; i < recipes.length; i++) {

    let recipe = recipes[i];

    let recipeDiv = document.createElement("div");

    recipeDiv.className = "recipe-item";
    recipeDiv.dataset.index = i;


    recipeDiv.innerHTML = `
      <div class="recipe-item-content">
        <p class="recipe-tag">${recipe.sourceLabel || "AI Recipe"}</p>
        <h3>${escapeHTML(recipe.name)}</h3>
        <p class="recipe-meta">${escapeHTML(recipe.cuisine || "Global")}</p>
        <p class="recipe-description">${escapeHTML(recipe.shortDescription)}</p>
      </div>
    `;

    // Added  the created recipe card to the results grid on the page
    resultsGrid.appendChild(recipeDiv);
  }
}