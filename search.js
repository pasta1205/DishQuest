// API configuration was set
const API_KEY = "AIzaSyBSBSt5DyCInXwCWt_uRtaJTHe5sAuLdbg";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

// HTML elements were selected from the page
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const grid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");

const modal = document.getElementById("recipe-modal");
const content = document.getElementById("recipe-details-content");
const closeBtn = document.getElementById("modal-close-btn");

// recipes storage was initialized
let recipes = [];


// form submission was handled
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();

  // input validation was done
  if (!query) {
    showMessage("Enter a dish name", true);
    return;
  }

  // searching message was shown
  showMessage(`Searching for "${query}"...`);

  // API request was triggered
  const data = await getRecipes(query);
  recipes = data;

  // response was checked and displayed
  if (data.length === 0) {
    showMessage("No recipes found", true);
  } else {
    showMessage("");
    showRecipes(data);
  }
});


// API request  made to fetch recipes
async function getRecipes(query) {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      // prompt  sent to Gemini API
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `Give 4 recipes for ${query} in pure JSON format only`
          }]
        }]
      })
    });

    const json = await res.json();

    // response text was extracted safely
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // JSON part was located inside response string
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    // JSON data was parsed
    const data = JSON.parse(text.slice(start, end));

    return data.recipes || [];

  } catch (error) {
    console.error(error);

    // error message was shown
    showMessage("Error fetching recipes", true);
    return [];
  }
}


// recipes were displayed in grid
function showRecipes(data) {
  grid.innerHTML = "";

  // each recipe card was created
  data.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "recipe-item";
    div.dataset.i = i;

    div.innerHTML = `
      <div class="recipe-item-content">
        <h3>${r.name}</h3>
        <p>${r.cuisine || "Global"}</p>
      </div>
    `;

    grid.appendChild(div);
  });
}


// recipe card click was handled
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");
  if (!card) return;

  const r = recipes[card.dataset.i];

  // recipe details were shown in modal
  content.innerHTML = `
    <h2>${r.name}</h2>

    <h3>Ingredients</h3>
    <ul>${(r.ingredients || []).map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${(r.steps || []).map(s => `<li>${s}</li>`).join("")}</ol>
  `;

  modal.classList.remove("hidden");
});


// modal close action was handled
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


// message display function was used
function showMessage(msg, isError = false) {
  messageArea.textContent = msg;

  // message style was updated based on error state
  messageArea.style.color = isError ? "red" : "black";
}