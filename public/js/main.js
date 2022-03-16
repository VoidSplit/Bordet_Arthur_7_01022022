
const recipeList = recipes;

function getStatut() {
  //console.info('getStatut')

  let params = new URL(document.location.href).searchParams;
  let filter = params.get("filter");

  if(filter) {
    let filterList = filter.split(",");
    return filterList;
  }
}

async function loadFilters(filters) {
  //console.info('loadFilters')

  filters.forEach((filter) =>
    addTag(filter, getTagColor(getTagList(recipeList), filter))
  );
}
document.getElementById('stats-button').addEventListener('click', () => {
  changeAlgo()
}) 
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
function normalizeStr(stringToReplace) {
  var first = stringToReplace.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>0123456789\{\}\[\]\\\/]/gi, '');
  first = first.replace(/[âà]/gi, 'a');
  first = first.replace(/[èéêë]/gi, 'e');
  first = first.replace(/[ç]/gi, 'c');
  first = first.replace(/[ï]/gi, 'i');
  return first.toLowerCase();
}
function getTagColor(list, tag) {

    if (list.ingredientList.map((e) => e.toLowerCase()).includes(normalizeStr(tag))) {
      let color = "#3282F7";
      return color;
    } else if (list.applianceList.map((e) => e.toLowerCase()).includes(normalizeStr(tag))) {
      let color = "#68D9A4";
      return color;
    } else if (list.ustensilsList.map((e) => e.toLowerCase()).includes(normalizeStr(tag))) {
      let color = "#ED6454";
      return color;
    }
}
function addTag(tag, color) {
  
  /*if(getStatut().filter(el => el == tag)) {
    console.log(`tag ${tag} already exist`)
  }*/
    let wrapper = document.getElementById("tags-wrapper");
    let tagDOM = document.createElement("div");
  
    tagDOM.setAttribute("class", "tag dfr");
    tagDOM.innerHTML = `<p>${tag}</p>`;
    tagDOM.style.background = color;
  
    let close = document.createElement("div");
  
    close.setAttribute("class", "close dfr centered");
    close.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"></path>
          </svg>
      `;
    close.addEventListener("click", () => {
      wrapper.removeChild(tagDOM);
      removeParam(tag);
    });
  
    tagDOM.appendChild(close);
    wrapper.appendChild(tagDOM);
    addParam(tag);
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
 