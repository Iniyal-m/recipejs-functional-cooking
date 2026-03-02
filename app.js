const RecipeApp = (function () {

  const recipes = [
    { id:1, title:"Spaghetti", difficulty:"easy", time:20,
      image:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      ingredients:["Pasta","Tomato sauce","Garlic","Olive oil"],
      steps:["Boil water","Add pasta","Mix sauce","Serve"] },

    { id:2, title:"Chicken Curry", difficulty:"medium", time:45,
      image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
      ingredients:["Chicken","Onion","Spices","Tomato"],
      steps:["Cut chicken","Cook masala","Add chicken","Serve"] },

    { id:3, title:"Beef Steak", difficulty:"hard", time:60,
      image:"https://images.unsplash.com/photo-1558030006-450675393462?w=400",
      ingredients:["Beef","Salt","Pepper","Butter"],
      steps:["Season","Cook","Rest","Serve"] },

    { id:4, title:"Salad", difficulty:"easy", time:10,
      image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      ingredients:["Lettuce","Tomato","Cucumber","Oil"],
      steps:["Chop","Mix","Serve"] },

    { id:5, title:"Pancakes", difficulty:"easy", time:15,
      image:"https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
      ingredients:["Flour","Milk","Egg","Sugar"],
      steps:["Mix","Cook","Flip","Serve"] },

    { id:6, title:"Biryani", difficulty:"hard", time:90,
      image:"https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
      ingredients:["Rice","Chicken","Spices","Onion"],
      steps:["Cook rice","Cook masala","Layer","Steam"] },

    { id:7, title:"Fried Rice", difficulty:"medium", time:30,
      image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
      ingredients:["Rice","Veg","Soy sauce","Egg"],
      steps:["Cook rice","Fry veg","Mix","Serve"] },

    { id:8, title:"Soup", difficulty:"easy", time:25,
      image:"https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
      ingredients:["Water","Veg","Salt","Pepper"],
      steps:["Boil","Add veg","Simmer","Serve"] }
  ];

  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  const recipeContainer = document.getElementById("recipe-container");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortButtons = document.querySelectorAll("[data-sort]");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const recipeCount = document.getElementById("recipe-count");

  const createRecipeCard = (recipe) => `
    <div class="recipe-card">
      <img src="${recipe.image}">
      <h3>${recipe.title}</h3>
      <p>Difficulty: ${recipe.difficulty}</p>
      <p>Time: ${recipe.time} mins</p>

      <button class="favorite-btn ${favorites.includes(recipe.id)?"active":""}" 
              data-id="${recipe.id}">❤️</button>

      <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
        Show Ingredients
      </button>

      <div class="ingredients hidden" data-id="${recipe.id}" data-container="ingredients">
        ${recipe.ingredients.map(i=>`<p>• ${i}</p>`).join("")}
      </div>

      <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
        Show Steps
      </button>

      <div class="steps hidden" data-id="${recipe.id}" data-container="steps">
        <ol>${recipe.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
      </div>
    </div>
  `;

  const applySearch = (list) => {
    if(!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i=>i.toLowerCase().includes(q))
    );
  };

  const applyFilter = (list) => {
    if(currentFilter==="favorites")
      return list.filter(r=>favorites.includes(r.id));
    if(currentFilter==="easy")
      return list.filter(r=>r.difficulty==="easy");
    if(currentFilter==="medium")
      return list.filter(r=>r.difficulty==="medium");
    if(currentFilter==="hard")
      return list.filter(r=>r.difficulty==="hard");
    if(currentFilter==="quick")
      return list.filter(r=>r.time<=30);
    return list;
  };

  const applySort = (list) => {
    if(currentSort==="name")
      return [...list].sort((a,b)=>a.title.localeCompare(b.title));
    if(currentSort==="time")
      return [...list].sort((a,b)=>a.time-b.time);
    return list;
  };

  const updateDisplay = () => {
    let result = [...recipes];
    result = applySearch(result);
    result = applyFilter(result);
    result = applySort(result);

    recipeCount.textContent =
      `Showing ${result.length} of ${recipes.length} recipes`;

    recipeContainer.innerHTML = result.map(createRecipeCard).join("");
  };

  recipeContainer.addEventListener("click",(e)=>{
    if(e.target.classList.contains("favorite-btn")){
      const id = Number(e.target.dataset.id);
      favorites = favorites.includes(id)
        ? favorites.filter(f=>f!==id)
        : [...favorites,id];
      localStorage.setItem("recipeFavorites",JSON.stringify(favorites));
      updateDisplay();
    }

    if(e.target.classList.contains("toggle-btn")){
      const id = e.target.dataset.id;
      const type = e.target.dataset.type;
      const container = document.querySelector(
        `[data-id="${id}"][data-container="${type}"]`
      );
      container.classList.toggle("hidden");
    }
  });

  filterButtons.forEach(btn=>{
    btn.addEventListener("click",()=>{
      currentFilter = btn.dataset.filter;
      updateDisplay();
    });
  });

  sortButtons.forEach(btn=>{
    btn.addEventListener("click",()=>{
      currentSort = btn.dataset.sort;
      updateDisplay();
    });
  });

  searchInput.addEventListener("input",()=>{
    searchQuery = searchInput.value;
    clearSearchBtn.style.display = searchQuery?"inline-block":"none";
    updateDisplay();
  });

  clearSearchBtn.addEventListener("click",()=>{
    searchInput.value="";
    searchQuery="";
    clearSearchBtn.style.display="none";
    updateDisplay();
  });

  const init = () => updateDisplay();

  return { init };

})();

document.addEventListener("DOMContentLoaded",RecipeApp.init);