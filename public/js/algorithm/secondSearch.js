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
    for(const item of list) {
      let searchTable = [];
      if (item.appliance)
        searchTable.push(item.appliance.toLowerCase().toString());
      if (item.description)
        searchTable.push(item.description.toLowerCase().toString());
      if (item.id) searchTable.push(item.id.toString());
      for(const element of item.ingredients) {
        if (element.ingredient) searchTable.push(element.ingredient.toString());
        if (element.quantity) searchTable.push(element.quantity.toString());
        if (element.unit) searchTable.push(element.unit.toString());
      }
      if (item.name) searchTable.push(item.name.toString());
      if (item.serving) searchTable.push(item.serving.toString());
      if (item.time) searchTable.push(item.time.toString());
      for(const element of item.ustensils) {
        if (element) searchTable.push(element.toString());
      }
      result.push(searchTable);
    }
    return result;
  }
  function filterTable(input, listToFilter, wantTimer) {
    let timerStart = new Date();
    const filtered = [];
    const table = [];
    
    for(const [i,list] of getListInfos(listToFilter).entries()) {
      const item = search(input, list);
      if (item.length > 0) {
        filtered.push(getListInfos(listToFilter)[i]);
      }
    }
    for(const [i,el] of filtered.entries()) {
      for(const a of listToFilter.filter((r) => r.id === parseInt(el[2]))) {
        table.push(a);
      }
    }
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

    for (const recipe of list) {
      for (const ingredient of recipe.ingredients) {
        if(!ingredientList.includes(normalizeStr(ingredient.ingredient))) {
          ingredientList.push(normalizeStr(ingredient.ingredient));
        }
      }
    }
    for (const recipe of list) {
      for (const ustencil of recipe.ustensils) {
        if(!ustensilsList.includes(normalizeStr(ustencil))) {
          ustensilsList.push(normalizeStr(ustencil));
        }
      }
    }
    for (const recipe of list) {
      if(!applianceList.includes(normalizeStr(recipe.appliance))) {
        applianceList.push(normalizeStr(recipe.appliance));
      }
    }
    return { ingredientList, applianceList, ustensilsList };
}