// ===== GEMINI CONFIG =====
// Stored the API key and model details for Gemini API usage
const GEMINI_API_KEY = "AIzaSyBSBSt5DyCInXwCWt_uRtaJTHe5sAuLdbg";
const GEMINI_MODEL = "gemini-3-flash-preview";
// Constructed the API URL using model and API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


//DOM ELEMENTS
// Selected required elements from HTML using their IDs
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

// Created an array to store current recipes
let currentRecipes = [];


//FORM SUBMIT
// Added event listener to handle form submission
if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevented page reload

    let searchTerm = searchInput.value.trim(); // Retrieved user input

    // Checked if input was not empty
    if (searchTerm !== "") {
      searchRecipes(searchTerm); // Called search function
    } else {
      showMessage("Enter a dish name", true); // Displayed error message
    }
  });
}


//SEARCH FUNCTION
// Defined async function to fetch recipes from API
async function searchRecipes(query) {
  showMessage(`Searching for "${query}"...`, false, true); // Displayed loading message
  clearResults(); // Cleared previous results

  try {
    // Called Gemini API with search prompt
    const data = await callGemini(promptForRecipeSearch(query));

    // Processed and enriched recipe data
    const recipes = enrichRecipes(data.recipes || []);
    clearMessage(); // Cleared loading message

    // Checked if recipes were found
    if (recipes.length > 0) {
      currentRecipes = recipes; // Stored recipes globally
      displayRecipes(recipes); // Displayed recipes
    } else {
      showMessage(`No recipes found for "${query}".`);
    }
  } catch (error) {
    console.error(error); // Logged error for debugging
    showMessage("Something went wrong. Please try again.", true);
  }
}


//DISPLAY RECIPES
// Displayed recipe cards dynamically
function displayRecipes(recipes) {
  resultsGrid.innerHTML = ""; // Cleared previous content

  recipes.forEach((recipe, i) => {
    let div = document.createElement("div"); // Created card element
    div.className = "recipe-item";
    div.dataset.index = i; // Stored index for later reference

    // Inserted recipe details into card
    div.innerHTML = `
      <div class="recipe-item-content">
        <p class="recipe-tag">${escapeHTML(recipe.sourceLabel || "AI Recipe")}</p>
        <h3>${escapeHTML(recipe.name)}</h3>
        <p class="recipe-meta">${escapeHTML(recipe.cuisine || "Global")}</p>
        <p class="recipe-description">${escapeHTML(recipe.shortDescription)}</p>
      </div>
    `;

    resultsGrid.appendChild(div); // Added card to grid
  });
}


//CLICK EVENT
// Added event listener to detect clicks on recipe cards
if (resultsGrid) {
  resultsGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".recipe-item");

    // Checked if a valid card was clicked
    if (card) {
      const index = Number(card.dataset.index); // Retrieved index
      const recipe = currentRecipes[index]; // Got recipe data

      if (recipe) {
        getRecipeDetails(recipe); // Displayed recipe details
      }
    }
  });
}


//MODAL
// Function to show modal popup
function showModal() {
  modal.classList.remove("hidden"); // Made modal visible
  document.body.style.overflow = "hidden"; // Disabled background scroll
}

// Function to close modal popup
function closeModal() {
  modal.classList.add("hidden"); // Hid modal
  document.body.style.overflow = ""; // Restored scrolling
}

// Added event to close button
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}


// RECIPE DETAILS
// Called when a recipe card was clicked
function getRecipeDetails(recipe) {
  displayRecipeDetails(recipe); // Displayed recipe content
  showModal(); // Opened modal
}

// Displayed full recipe details inside modal
function displayRecipeDetails(recipe) {

  // Converted ingredients array to HTML list
  let ingredientsHTML = recipe.ingredients
    ? recipe.ingredients.map(i => `<li>${escapeHTML(i)}</li>`).join("")
    : "";

  // Converted steps array to ordered list
  let stepsHTML = recipe.steps
    ? recipe.steps.map(s => `<li>${escapeHTML(s)}</li>`).join("")
    : "";

  // Created tips section if available
  let tipsHTML = recipe.tips && recipe.tips.length > 0
    ? `<h3>Tips</h3><ul>${recipe.tips.map(t => `<li>${escapeHTML(t)}</li>`).join("")}</ul>`
    : "";

  // Inserted all details into modal content
  modalContent.innerHTML = `
    <h2>${escapeHTML(recipe.name)}</h2>
    <h3>Ingredients</h3>
    <ul>${ingredientsHTML}</ul>
    <h3>Instructions</h3>
    <ol>${stepsHTML}</ol>
    ${tipsHTML}
  `;
}


//MESSAGE FUNCTIONS
// Displayed messages (error/loading/normal)
function showMessage(message, isError = false, isLoading = false) {
  if (!messageArea) return;

  messageArea.textContent = message; // Set message text
  messageArea.className = "message"; // Reset class

  if (isError) messageArea.classList.add("error"); // Added error style
  if (isLoading) messageArea.classList.add("loading"); // Added loading style
}

// Cleared message area
function clearMessage() {
  if (messageArea) messageArea.textContent = "";
}

// Cleared previous results
function clearResults() {
  if (resultsGrid) resultsGrid.innerHTML = "";
}


//PROMPT
// Generated prompt to send to Gemini API
function promptForRecipeSearch(query) {
  return `Find 4 recipes for "${query}" in JSON format. Provide the response as a raw JSON object only:
{
  "recipes": [
    {
      "name": "string",
      "cuisine": "string",
      "shortDescription": "string",
      "ingredients": ["string"],
      "steps": ["string"],
      "tips": ["string"],
      "sourceLabel": "AI Recipe"
    }
  ]
}`;
}


//ENRICH RECIPES
// Ensured all required fields exist in recipes
function enrichRecipes(recipes) {
  return recipes.map(r => ({
    ...r,
    ingredients: r.ingredients || ["Not available"],
    steps: r.steps || ["Not available"],
    tips: r.tips || []
  }));
}


//GEMINI API
// Called Gemini API and processed response
async function callGemini(prompt) {
  const res = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) throw new Error("API error");

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    // Extracted JSON part from response
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}') + 1;
    const jsonString = rawText.substring(jsonStart, jsonEnd);

    return JSON.parse(jsonString); // Parsed JSON
  } catch (e) {
    throw new Error("Invalid JSON from API");
  }
}


//UTILITY
// Escaped HTML to prevent XSS attacks
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}