// API returns one random element in JSON format
const RANDOM_API = "https://www.themealdb.com/api/json/v1/1/random.php";

// ELEMENTS 
const resultsGrid = document.getElementById("results-grid");//show cards
const messageArea = document.getElementById("message-area");//Loading
const randomButton = document.getElementById("random-button");//button
const modal = document.getElementById("recipe-modal");//popup+background
const modalContent = document.getElementById("recipe-details-content");//content of popup
const modalCloseBtn = document.getElementById("modal-close-btn");//close

let currentRecipes = [];//array stores current recipes for later use

// ===== EVENTS =====
randomButton.addEventListener("click", getRandomRecipes);//opens popup

//check if recipe card is clicked
resultsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");//if clicked inside recipe-item returns html element
  if (!card) return;//if nothing clicked

  const index = Number(card.dataset.index);//index of clicked
  showRecipeDetails(currentRecipes[index]);
});

modalCloseBtn.addEventListener("click", closeModal);//close popup
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});//if outside popup clocked close it

// ===== MAIN =====
async function getRandomRecipes() {
  showMessage("Fetching recipes...", false, true);
  clearResults();//clears previous data

  try {
    const recipes = [];

    // Get 4 random meals
    for (let i = 0; i < 4; i++) {
      const res = await fetch(RANDOM_API);//calls api and get raw data
      const data = await res.json();//converted to json
      recipes.push(data.meals[0]);//add to recipe array 
    }

    currentRecipes = recipes;//later use
    displayRecipes(recipes);
    clearMessage();//Fetching msg deleted
  } catch (err) {
    showMessage("Failed to fetch recipes", true);
  }
}

// ===== DISPLAY =====create card
function displayRecipes(recipes) {
  resultsGrid.innerHTML = "";//removes previous

  recipes.forEach((meal, index) => {
    const div = document.createElement("div");
    div.classList.add("recipe-item");
    div.dataset.index = index;//saved for use when clicked

    div.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea} • ${meal.strCategory}</p>
    `;

    resultsGrid.appendChild(div);//display card on screen
  });
}

// ===== DETAILS ===== popup
function showRecipeDetails(meal) {
  const ingredients = [];//ingredients list

  for (let i = 1; i <= 20; i++) {//20 ingredients
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {//if not null or empty
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
//write inside popup
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

  showModal();//opens popup
}

// ===== UI =====
function showModal() {//line  33
  modal.classList.remove("hidden");//make it visible
  document.body.style.overflow = "hidden";//disables page scroll
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
}//clear msg area

function clearResults() {
  resultsGrid.innerHTML = "";
}//clear all cards