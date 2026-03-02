const RecipeApp = (function () {

    console.log("RecipeApp initializing...");

    // ======================
    // RECIPE DATA
    // ======================

    const recipes = [
        {
            id: 1,
            title: "Spaghetti",
            difficulty: "easy",
            time: 20,
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
            ingredients: ["Pasta", "Tomato sauce", "Garlic", "Olive oil"],
            steps: [
                "Boil water",
                "Add pasta",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Heat oil",
                        "Add garlic",
                        "Add tomato sauce"
                    ]
                },
                "Mix and serve"
            ]
        },
        {
            id: 2,
            title: "Chicken Curry",
            difficulty: "medium",
            time: 45,
            image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
            ingredients: ["Chicken", "Onion", "Spices", "Tomato"],
            steps: [
                "Cut chicken",
                {
                    text: "Cook masala",
                    substeps: [
                        "Heat oil",
                        "Add onion",
                        {
                            text: "Add spices",
                            substeps: [
                                "Add chili powder",
                                "Add turmeric"
                            ]
                        }
                    ]
                },
                "Add chicken",
                "Cook until done"
            ]
        },
        {
            id: 3,
            title: "Beef Steak",
            difficulty: "hard",
            time: 60,
            image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
            ingredients: ["Beef", "Salt", "Pepper", "Butter"],
            steps: ["Season beef", "Heat pan", "Cook steak", "Rest and serve"]
        },
        {
            id: 4,
            title: "Salad",
            difficulty: "easy",
            time: 10,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
            ingredients: ["Lettuce", "Tomato", "Cucumber", "Olive oil"],
            steps: ["Chop vegetables", "Mix together", "Add dressing"]
        },
        {
            id: 5,
            title: "Pancakes",
            difficulty: "easy",
            time: 15,
            image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
            ingredients: ["Flour", "Milk", "Eggs", "Sugar"],
            steps: ["Mix ingredients", "Heat pan", "Pour batter", "Flip pancake"]
        },
        {
            id: 6,
            title: "Biryani",
            difficulty: "hard",
            time: 90,
            image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
            ingredients: ["Rice", "Chicken", "Spices", "Onion"],
            steps: ["Cook rice", "Prepare masala", "Layer rice and masala", "Steam and serve"]
        },
        {
            id: 7,
            title: "Fried Rice",
            difficulty: "medium",
            time: 30,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
            ingredients: ["Rice", "Vegetables", "Soy sauce", "Egg"],
            steps: ["Cook rice", "Stir fry vegetables", "Add rice", "Add soy sauce"]
        },
        {
            id: 8,
            title: "Soup",
            difficulty: "easy",
            time: 25,
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
            ingredients: ["Water", "Vegetables", "Salt", "Pepper"],
            steps: ["Boil water", "Add vegetables", "Simmer", "Serve hot"]
        }
    ];

    // ======================
    // STATE
    // ======================

    let currentFilter = "all";
    let currentSort = "none";

    const recipeContainer = document.getElementById("recipe-container");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    // ======================
    // RECURSIVE FUNCTION
    // ======================

    const renderSteps = (steps) => {
        let html = "<ol>";

        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li>${step}</li>`;
            } else {
                html += `<li>${step.text}`;
                if (step.substeps) {
                    html += renderSteps(step.substeps);
                }
                html += `</li>`;
            }
        });

        html += "</ol>";
        return html;
    };

    // ======================
    // CARD TEMPLATE
    // ======================

    const createRecipeCard = (recipe) => {
        return `
        <div class="recipe-card">

            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            <p><strong>Time:</strong> ${recipe.time} mins</p>

            <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
                Show Ingredients
            </button>

            <div class="ingredients hidden" data-id="${recipe.id}" data-container="ingredients">
                ${recipe.ingredients.map(i => `<p>• ${i}</p>`).join("")}
            </div>

            <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
                Show Steps
            </button>

            <div class="steps hidden" data-id="${recipe.id}" data-container="steps">
                ${renderSteps(recipe.steps)}
            </div>

        </div>
        `;
    };

    // ======================
    // RENDER
    // ======================

    const renderRecipes = (list) => {
        recipeContainer.innerHTML = list.map(createRecipeCard).join("");
    };

    // ======================
    // FILTER
    // ======================

    const applyFilter = (list, filter) => {
        switch (filter) {
            case "easy":
                return list.filter(r => r.difficulty === "easy");
            case "medium":
                return list.filter(r => r.difficulty === "medium");
            case "hard":
                return list.filter(r => r.difficulty === "hard");
            case "quick":
                return list.filter(r => r.time <= 30);
            default:
                return list;
        }
    };

    // ======================
    // SORT
    // ======================

    const applySort = (list, sort) => {
        switch (sort) {
            case "name":
                return [...list].sort((a, b) => a.title.localeCompare(b.title));
            case "time":
                return [...list].sort((a, b) => a.time - b.time);
            default:
                return list;
        }
    };

    const updateDisplay = () => {
        let result = [...recipes];
        result = applyFilter(result, currentFilter);
        result = applySort(result, currentSort);
        renderRecipes(result);
    };

    const updateActiveButtons = () => {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add("active");
            }
        });

        sortButtons.forEach(btn => {
            btn.classList.remove("active");
            if (btn.dataset.sort === currentSort) {
                btn.classList.add("active");
            }
        });
    };

    // ======================
    // EVENT DELEGATION
    // ======================

    recipeContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains("toggle-btn")) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.type;

        const container = document.querySelector(
            `[data-id="${id}"][data-container="${type}"]`
        );

        container.classList.toggle("hidden");

        if (container.classList.contains("hidden")) {
            e.target.textContent = `Show ${type}`;
        } else {
            e.target.textContent = `Hide ${type}`;
        }
    });

    // ======================
    // FILTER & SORT EVENTS
    // ======================

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            updateActiveButtons();
            updateDisplay();
        });
    });

    sortButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentSort = btn.dataset.sort;
            updateActiveButtons();
            updateDisplay();
        });
    });

    const init = () => {
        updateDisplay();
        updateActiveButtons();
        console.log("RecipeApp ready!");
    };

    return {
        init
    };

})();

document.addEventListener("DOMContentLoaded", RecipeApp.init);