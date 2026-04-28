// ===== API =====
const RANDOM_API = "https://www.themealdb.com/api/json/v1/1/random.php";

// ===== ELEMENTS =====
const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

let currentRecipes = [];

// ===== EVENTS =====
randomButton.addEventListener("click", getRandomRecipes);

resultsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");
  if (!card) return;

  const index = Number(card.dataset.index);
  showRecipeDetails(currentRecipes[index]);
});

modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ===== MAIN =====
async function getRandomRecipes() {
  showMessage("Fetching recipes...", false, true);
  clearResults();

  try {
    const recipes = [];

    // Get 4 random meals
    for (let i = 0; i < 4; i++) {
      const res = await fetch(RANDOM_API);
      const data = await res.json();
      recipes.push(data.meals[0]);
    }

    currentRecipes = recipes;
    displayRecipes(recipes);
    clearMessage();
  } catch (err) {
    showMessage("Failed to fetch recipes", true);
  }
}

// ===== DISPLAY =====
function displayRecipes(recipes) {
  resultsGrid.innerHTML = "";

  recipes.forEach((meal, index) => {
    const div = document.createElement("div");
    div.classList.add("recipe-item");
    div.dataset.index = index;

    div.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea} • ${meal.strCategory}</p>
    `;

    resultsGrid.appendChild(div);
  });
}

// ===== DETAILS =====
function showRecipeDetails(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  modalContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" style="width:100%; border-radius:10px; margin:10px 0;" />

    <p><strong>Cuisine:</strong> ${meal.strArea}</p>
    <p><strong>Category:</strong> ${meal.strCategory}</p>

    <h3>Ingredients</h3>
    <ul>
      ${ingredients.map(i => `<li>${i}</li>`).join("")}
    </ul>

    <h3>Instructions</h3>
    <p style="line-height:1.6;">${meal.strInstructions}</p>

    ${
      meal.strYoutube
        ? `<a href="${meal.strYoutube}" target="_blank">▶ Watch on YouTube</a>`
        : ""
    }
  `;

  showModal();
}

// ===== UI =====
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