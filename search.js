// DOM elements were selected from the HTML
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const grid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");

const modal = document.getElementById("recipe-modal");
const content = document.getElementById("recipe-details-content");
const closeBtn = document.getElementById("modal-close-btn");

// An array was created to store fetched recipes
let recipes = [];

// A submit event listener was added to handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();

  // Input validation was performed
  if (!query) {
    showMessage("Enter a dish name", true);
    return;
  }

  // A searching message was displayed to the user
  showMessage(`Searching for "${query}"...`);

  // Recipes were fetched based on the user query
  const data = await getRecipes(query);
  recipes = data;

  // Result handling was done based on fetched data
  if (data.length === 0) {
    showMessage("No recipes found", true);
  } else {
    showMessage("");
    showRecipes(data);
  }
});


// RECIPES WERE FETCHED FROM THEMEALDB API
async function getRecipes(query) {
  try {
    // API request was sent to TheMealDB
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const data = await res.json();

    // Checked if meals existed in response
    if (!data.meals) return [];

    // API data was transformed into a cleaner format
    return data.meals.map(meal => {
      const ingredients = [];

      // Ingredients and measurements were extracted
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ing && ing.trim()) {
          ingredients.push(`${ing} - ${measure || ""}`);
        }
      }

      // A structured recipe object was returned
      return {
        name: meal.strMeal,
        cuisine: meal.strArea || "Global",
        image: meal.strMealThumb,
        ingredients: ingredients,
        steps: meal.strInstructions
          ? meal.strInstructions.split(". ").filter(s => s.trim())
          : []
      };
    });

  } catch (error) {
    // Errors were handled and logged
    console.error(error);
    showMessage("Error fetching recipes", true);
    return [];
  }
}


// RECIPES WERE DISPLAYED IN THE GRID
function showRecipes(data) {
  grid.innerHTML = "";

  // Each recipe card was created dynamically
  data.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "recipe-item";
    div.dataset.i = i;

    div.innerHTML = `
      <div class="recipe-item-content">
        <img src="${r.image}" alt="${r.name}" />
        <h3>${r.name}</h3>
        <p>${r.cuisine}</p>
      </div>
    `;

    grid.appendChild(div);
  });
}


// CLICK EVENT WAS ADDED TO SHOW RECIPE DETAILS
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");
  if (!card) return;

  const r = recipes[card.dataset.i];

  // Recipe details were injected into the modal
  content.innerHTML = `
    <h2>${r.name}</h2>

    <img src="${r.image}" alt="${r.name}" style="width:100%;border-radius:10px;margin:10px 0;" />

    <h3>Ingredients</h3>
    <ul>
      ${r.ingredients.map(i => `<li>${i}</li>`).join("")}
    </ul>

    <h3>Steps</h3>
    <ol>
      ${r.steps.map(s => `<li>${s}</li>`).join("")}
    </ol>
  `;

  // Modal was displayed
  modal.classList.remove("hidden");
});


// MODAL CLOSE FUNCTIONALITY WAS ADDED
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


// MESSAGE DISPLAY FUNCTION WAS CREATED
function showMessage(msg, isError = false) {
  messageArea.textContent = msg;

  // Message color was set based on error state
  messageArea.style.color = isError ? "red" : "black";
}