const GEMINI_API_KEY = "AIzaSyBSBSt5DyCInXwCWt_uRtaJTHe5sAuLdbg";
const GEMINI_MODEL = "gemini-3-flash-preview";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

let currentRecipes = [];

// Auto load random recipes on page load
getRandomRecipe();

// Button click
randomButton.addEventListener("click", getRandomRecipe);

// Click on recipe card
resultsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");
  if (!card) return;

  const index = Number(card.dataset.index);
  const recipe = currentRecipes[index];
  getRecipeDetails(recipe);
});

// Close modal
modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

async function getRandomRecipe() {
  showMessage("Fetching random recipes...", false, true);
  clearResults();

  try {
    const data = await callGemini(promptForRandomRecipes());
    const recipes = data.recipes || [];

    clearMessage();

    if (recipes.length === 0) {
      showMessage("No recipes found", true);
      return;
    }

    currentRecipes = recipes;
    displayRecipes(recipes);
  } catch (err) {
    showMessage("Error fetching recipes", true);
  }
}

function displayRecipes(recipes) {
  resultsGrid.innerHTML = "";

  recipes.forEach((recipe, index) => {
    const div = document.createElement("div");
    div.classList.add("recipe-item");
    div.dataset.index = index;

    div.innerHTML = `
      <h3>${escapeHTML(recipe.name)}</h3>
    `;

    resultsGrid.appendChild(div);
  });
}

async function getRecipeDetails(recipe) {
  modalContent.innerHTML = "Loading...";
  showModal();

  try {
    const data = await callGemini(promptForRecipeDetails(recipe));
    const r = data.recipe;

    modalContent.innerHTML = `
      <h2>${escapeHTML(r.name)}</h2>
      <p>${escapeHTML(r.shortDescription)}</p>

      <h3>Ingredients</h3>
      <ul>${r.ingredients.map(i => `<li>${escapeHTML(i)}</li>`).join("")}</ul>

      <h3>Steps</h3>
      <ol>${r.steps.map(s => `<li>${escapeHTML(s)}</li>`).join("")}</ol>
    `;
  } catch (err) {
    modalContent.innerHTML = "Failed to load details";
  }
}

function showModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function showMessage(msg, isError = false, isLoading = false) {
  messageArea.textContent = msg;
  messageArea.className = "message";

  if (isError) messageArea.classList.add("error");
  if (isLoading) messageArea.classList.add("loading");
}

function clearMessage() {
  messageArea.textContent = "";
}

function clearResults() {
  resultsGrid.innerHTML = "";
}

// ===== Gemini API =====

async function callGemini(prompt) {
  const res = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) throw new Error("API error");

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ===== Prompts =====

function promptForRandomRecipes() {
  return `Generate 4 random recipes in JSON:
{
  "recipes":[
    { "name":"string", "shortDescription":"string" }
  ]
}`;
}

function promptForRecipeDetails(recipe) {
  return `Give full recipe for ${recipe.name} in JSON:
{
  "recipe":{
    "name":"string",
    "shortDescription":"string",
    "ingredients":["string"],
    "steps":["string"]
  }
}`;
}

// ===== Utils =====

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}