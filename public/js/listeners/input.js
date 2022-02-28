const ingredientInput = document.getElementById("ingredient-search");
const appareilInput = document.getElementById("appareil-search");
const ustencilsInput = document.getElementById("ustencils-search");
const mainInput = document.getElementById("searchbar");

ingredientInput.addEventListener("input", (e) => {
  let ingredientList = [];
  let applianceList = undefined;
  let ustensilsList = undefined;
  ingredientList = search(
    e.target.value.toLowerCase(),
    getTagList(recipeList).ingredientList
  );
  getTime(e.target.value.toLowerCase(), "ingredients")

  generateDropdownList({ ingredientList, applianceList, ustensilsList });
});
appareilInput.addEventListener("input", (e) => {
  let ingredientList = undefined;
  let applianceList = [];
  let ustensilsList = undefined;
  applianceList = search(
    e.target.value.toLowerCase(),
    getTagList(recipeList).applianceList
  );
  getTime(e.target.value.toLowerCase(), "appareils")
  generateDropdownList({ ingredientList, applianceList, ustensilsList });
});
ustencilsInput.addEventListener("input", (e) => {
  let ingredientList = undefined;
  let applianceList = undefined;
  let ustensilsList = [];
  ustensilsList = search(
    e.target.value.toLowerCase(),
    getTagList(recipeList).ustensilsList
  );
  getTime(e.target.value.toLowerCase(), "ustenciles")
  generateDropdownList({ ingredientList, applianceList, ustensilsList });
});

mainInput.addEventListener("input", (e) => {
  displayRecipes(searchRecipe(e.target.value.toLowerCase(), recipeList));
  getTime(e.target.value.toLowerCase(), "main")
});
