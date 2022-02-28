const recipeList = recipes;

function getStatut() {
  //console.info('getStatut')

  let params = new URL(document.location.href).searchParams;
  let filter = params.get("filter");

  let filterList = filter.split(",");
  return filterList;
}

async function loadFilters(filters) {
  //console.info('loadFilters')

  filters.forEach((filter) =>
    addTag(filter, getTagColor(getTagList(recipeList), filter))
  );
}

function changeAlgo() {
  function getAlgorithm() {
    switch (sessionStorage.getItem("algo")) {
      case "2":
        sessionStorage.setItem("algo", "1");
        break;
      case "1":
        sessionStorage.setItem("algo", "2");
        break;
      case undefined:
        sessionStorage.setItem("algo", "1");
        break;
      case null:
        sessionStorage.setItem("algo", "1");
        break;
    }
  }
  getAlgorithm();

  // coco recipelist
  let time = searchRecipe(recipeList, recipeList, true);
  let number = document.getElementById("recipes-wrapper").childElementCount;

  console.group((label = "Algorithme changé:"));
  console.info(
    `%cAlgorithme n°${sessionStorage.getItem("algo")}`,
    "font-weight: bold; color: yellow;"
  );
  switch (true) {
    case 0 <= time && time <= 15:
      console.info(
        `Temps d'execution: %c${time}ms`,
        "font-weight: bold; color: lime;"
      );
      break;
    case 15 < time && time < 40:
      console.info(
        `Temps d'execution: %c${time}ms`,
        "font-weight: bold; color: orange;"
      );
      break;
    case time >= 40:
      console.info(
        `Temps d'execution: %c${time}ms`,
        "font-weight: bold; color: red;"
      );
      break;
  }
  console.info(
    `Nombre d'objets traîtés: %c${number}`,
    "font-weight: bold; color: white;"
  );
  console.groupEnd();
}
function getTime(txt, item) {
  let time;
  switch (item) {
    case "main": 
      let main = document.getElementById('execution-main');
      time = searchRecipe(txt, recipeList, true);
    
      main.innerHTML = `${time}ms`
      break;
    case "ingredients": 
      let ingredientTimer = document.getElementById('execution-ingredients');
      time = search(txt.toLowerCase(), getTagList(recipeList).ingredientList, true);
    
      ingredientTimer.innerHTML = `${time}ms`
      break;
    case "appareils": 
      let appareilTimer = document.getElementById('execution-appareils');
      time = search(txt.toLowerCase(), getTagList(recipeList).applianceList, true);
    
      appareilTimer.innerHTML = `${time}ms`
      break;
    case "ustenciles": 
      let ustencilsTimer = document.getElementById('execution-ustenciles');
      time = search(txt.toLowerCase(), getTagList(recipeList).ustensilsList, true);
    
      ustencilsTimer.innerHTML = `${time}ms`
      break;
  }
}

function init() {
  //console.info('init')

  let params = new URL(document.location.href).searchParams;
  const filter = params.get("filter");

  if (filter) loadFilters(filter.split(","));
  displayRecipes(recipeList);
  generateDropdownList(getTagList(recipeList));
}

init();
 