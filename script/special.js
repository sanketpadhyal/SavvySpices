const loaderOverlay = document.getElementById("loaderOverlay");
let allMeals = [];
let displayedMeals = [];

function showLoader(){ loaderOverlay.style.display="flex"; }
function hideLoader(){ loaderOverlay.style.display="none"; }

async function loadRecipes() {
  showLoader();
  allMeals = [];
  const selectedCategory = document.getElementById("mealType").value || "Vegetarian";
  const categories = ["Beef","Chicken","Seafood","Vegetarian","Pork","Dessert","Lamb","Miscellaneous","Starter"];
  
  for(const cat of categories){
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
      const data = await res.json();
      if(data.meals){
        if(selectedCategory === "Vegetarian" && cat === "Vegetarian"){
          allMeals.push(...data.meals.filter(m => {
            const name = m.strMeal.toLowerCase();
            return !name.includes("chicken") && !name.includes("beef") && !name.includes("pork") &&
                   !name.includes("lamb") && !name.includes("seafood") && !name.includes("egg") && !name.includes("eggs");
          }));
        } else if(cat === selectedCategory) {
          allMeals.push(...data.meals);
        }
      }
    } catch(err){ console.warn("Error fetching category:", cat); }
  }

  displayedMeals = shuffleArray(allMeals).slice(0, 250);
  displayMeals();
  hideLoader();
}

function displayMeals() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  
  displayedMeals.forEach((meal, index) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="recipe-info">
        <h3>${meal.strMeal}</h3>
        <p>
          Try this delicious dish! 
          <br>
          Visit <strong>SavvySpices AI</strong> for the full recipe — just type the name of this dish there.
        </p>
      </div>
    `;
    resultsDiv.appendChild(card);
    setTimeout(()=>{ card.classList.add("show"); }, index*40);
  });
}

function shuffleArray(array){
  const arr = array.slice();
  for(let i = arr.length-1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function refreshRecipes(){
  displayedMeals = shuffleArray(displayedMeals);
  displayMeals();
}

window.onload = () => {
  document.getElementById("mealType").value = "Vegetarian";
  loadRecipes();
};