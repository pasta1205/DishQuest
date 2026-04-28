const ingredientsForm = document.getElementById("ingredients-form");//input box
const ingredientsInput = document.getElementById("ingredients-input");//user text
const resultsGrid = document.getElementById("results-grid");//result display
const messageArea = document.getElementById("message-area");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

let currentMeals = [];

// ===== EVENTS =====

ingredientsForm.addEventListener("submit", (e) => {//submit button
  e.preventDefault();//stops page reload
  const ingredients = ingredientsInput.value.trim();//user input

  if (!ingredients) {
    showMessage("Please enter ingredients", true);
    return;// if no input
  }

  fetchMealsByIngredient(ingredients);//api function called line 40
});

modalCloseBtn.addEventListener("click", closeModal);//close popup btn
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});//if outside popup clocked close it

resultsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");//if anything clicked returns casrd element
  if (!card) return;

  const index = Number(card.dataset.index);//index of clicked
  const meal = currentMeals[index];
  fetchMealDetails(meal.idMeal);
});

// ===== FETCH MEALS =====
async function fetchMealsByIngredient(ingredients) {
  showMessage("Finding recipes...", false, true);
  clearResults();//removes prev recipes

  try {
    // Take first ingredient only (API limitation)
    const firstIngredient = ingredients.split(",")[0].trim();

    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${firstIngredient}`
    );//api req sent

    const data = await res.json();//raw response in HTTP response format

    if (!data.meals) {
      showMessage("No recipes found for given ingredients", true);
      return;
    }

    currentMeals = data.meals.slice(0, 8); // limit results max 8 results
    displayMeals(currentMeals);
    clearMessage();
  } catch (err) {
    showMessage("Error fetching recipes", true);
  }
}

// ===== DISPLAY =====
function displayMeals(meals) {
  resultsGrid.innerHTML = "";

  meals.forEach((meal, index) => {
    const div = document.createElement("div");
    div.classList.add("recipe-item");
    div.dataset.index = index;

    div.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
    `;

    resultsGrid.appendChild(div);
  });
}

// ===== DETAILS ===== full recipe
async function fetchMealDetails(id) {
  modalContent.innerHTML = "Loading...";
  showModal();

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await res.json();
    const meal = data.meals[0];//first recipe object extracted

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      }
    }

    modalContent.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" style="width:100%; border-radius:12px;" />

      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>

      <h3>Ingredients</h3>
      <ul>
        ${ingredients.map((i) => `<li>${i}</li>`).join("")}
      </ul>

      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>

      ${
        meal.strYoutube
          ? `<h3>Video</h3>
             <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>`
          : ""
      }
    `;
  } catch (err) {
    modalContent.innerHTML = "Failed to load details";
  }
}

// ===== UI HELPERS =====
function showModal() {//popup//hide popup
  modal.classList.remove("hidden");//maker it visible
  document.body.style.overflow = "hidden";//diasble scroll
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function showMessage(msg, isError = false, isLoading = false) {
  messageArea.textContent = msg;
  messageArea.className = "message";

  if (isError) messageArea.classList.add("error");//red if error
  if (isLoading) messageArea.classList.add("loading");//blue for loading
}

function clearMessage() {
  messageArea.textContent = "";
}//clear msg area

function clearResults() {
  resultsGrid.innerHTML = "";
}//clear all cards