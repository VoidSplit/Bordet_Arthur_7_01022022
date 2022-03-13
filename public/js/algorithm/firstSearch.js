function search(input, list,wantTimer) {
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
  function getListInfos(list) {
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