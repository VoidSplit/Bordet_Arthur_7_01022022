function search(input, list,wantTimer) {
  //console.info('search')
  let timerStart = new Date();

  const filteredList = list.filter((el) => el.toLowerCase().includes(input));
  timerEnd = new Date();
  let timer = timerEnd - timerStart;
  if (wantTimer === true) {
    return timer;
  } else {
    return filteredList;
  }
}
function searchRecipe(a, b, c) {
  // console.info('searchRecipe')
  function getListInfos(list) {
    // console.info('getListInfos')
    let result = [];
    list.forEach((item) => {
      let searchTable = [];
      if (item.appliance)
        searchTable.push(item.appliance.toLowerCase().toString());
      if (item.description)
        searchTable.push(item.description.toLowerCase().toString());
      if (item.id) searchTable.push(item.id.toString());
      item.ingredients.forEach((element) => {
        if (element.ingredient) searchTable.push(element.ingredient.toString());
        if (element.quantity) searchTable.push(element.quantity.toString());
        if (element.unit) searchTable.push(element.unit.toString());
      });
      if (item.name) searchTable.push(item.name.toString());
      if (item.serving) searchTable.push(item.serving.toString());
      if (item.time) searchTable.push(item.time.toString());
      item.ustensils.forEach((element) => {
        if (element) searchTable.push(element.toString());
      });
      result.push(searchTable);
    });
    return result;
  }

  function filterTable(input, listToFilter, wantTimer) {
    let timerStart = new Date();
    // console.warn('filterTable')

    const filtered = [];
    const table = [];
    getListInfos(listToFilter).forEach((list, i) => {
      const item = search(input, list);
      if (item.length > 0) {
        filtered.push(getListInfos(listToFilter)[i]);
      }
    });

    filtered.forEach((el, i) => {
      listToFilter
        .filter((r) => r.id === parseInt(el[2]))
        .forEach((a) => {
          table.push(a);
        });
    });
    //console.log(filtered)
    //console.log(table)
    timerEnd = new Date();
    let timer = timerEnd - timerStart;
    if (wantTimer === true) {
      return timer;
    } else {
      return table;
    }
  }

  return filterTable(a, b, c);
}

function getTagList(list) {
  //console.info('getTagList')

  let ingredientList = [];
  let applianceList = [];
  let ustensilsList = [];

  list.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (
        !ingredientList.find(
          (a) => a.toLowerCase() === ingredient.ingredient.toLowerCase()
        )
      ) {
        ingredientList.push(ingredient.ingredient);
      }
    });
  });
  list.forEach((recipe) => {
    if (
      !applianceList.find(
        (a) => a.toLowerCase() === recipe.appliance.toLowerCase()
      )
    ) {
      applianceList.push(recipe.appliance);
    }
  });
  list.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      if (
        !ustensilsList.find((a) => a.toLowerCase() === ustensil.toLowerCase())
      ) {
        ustensilsList.push(ustensil);
      }
    });
  });

  
  return { ingredientList, applianceList, ustensilsList };
}
function getTagColor(list, tag) {
  //console.info('getTagColor')

  if (list.ingredientList.map((e) => e.toLowerCase()).includes(tag)) {
    let color = "#3282F7";
    return color;
  } else if (list.applianceList.map((e) => e.toLowerCase()).includes(tag)) {
    let color = "#68D9A4";
    return color;
  } else if (list.ustensilsList.map((e) => e.toLowerCase()).includes(tag)) {
    let color = "#ED6454";
    return color;
  }
}
function addTag(tag, color) {
  //console.info('addTag')

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
