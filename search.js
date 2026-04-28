// DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const grid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");

const modal = document.getElementById("recipe-modal");
const content = document.getElementById("recipe-details-content");
const closeBtn = document.getElementById("modal-close-btn");

// recipes storage
let recipes = [];

// form submission handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();

  if (!query) {
    showMessage("Enter a dish name", true);
    return;
  }

  showMessage(`Searching for "${query}"...`);

  const data = await getRecipes(query);
  recipes = data;

  if (data.length === 0) {
    showMessage("No recipes found", true);
  } else {
    showMessage("");
    showRecipes(data);
  }
});


// FETCH RECIPES FROM THEMEALDB
async function getRecipes(query) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const data = await res.json();

    if (!data.meals) return [];

    return data.meals.map(meal => {
      const ingredients = [];

      // extract ingredients + measures
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ing && ing.trim()) {
          ingredients.push(`${ing} - ${measure || ""}`);
        }
      }

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
    console.error(error);
    showMessage("Error fetching recipes", true);
    return [];
  }
}


// DISPLAY RECIPES IN GRID
function showRecipes(data) {
  grid.innerHTML = "";

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


// CLICK EVENT FOR RECIPE DETAILS
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");
  if (!card) return;

  const r = recipes[card.dataset.i];

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

  modal.classList.remove("hidden");
});


// CLOSE MODAL
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


// MESSAGE FUNCTION
function showMessage(msg, isError = false) {
  messageArea.textContent = msg;
  messageArea.style.color = isError ? "red" : "black";
}