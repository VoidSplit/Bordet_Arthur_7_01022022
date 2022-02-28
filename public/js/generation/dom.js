function generateDropdownList(list) {
  //console.info('generateDropdownList')

  let ingredientsDropdownList = document.getElementById("ingredients-tag-list");
  let appareilsDropdownList = document.getElementById("appareils-tag-list");
  let ustencilesDropdownList = document.getElementById("ustenciles-tag-list");


  if (list.ingredientList !== undefined) {
    ingredientsDropdownList.innerHTML = "";

    list.ingredientList.forEach((element) => {
      let span = document.createElement("span");

      span.textContent = element;
      ingredientsDropdownList.appendChild(span);
      span.addEventListener("click", function () {
        addTag(element, "#3282F7");
      });
    });
  }
  if (list.applianceList !== undefined) {
    appareilsDropdownList.innerHTML = "";

    list.applianceList.slice(0, 30).forEach((element) => {
      let span = document.createElement("span");

      span.textContent = element;
      appareilsDropdownList.appendChild(span);
      span.addEventListener("click", function () {
        addTag(element, "#68D9A4");
      });
    });
  }
  if (list.ustensilsList !== undefined) {
    ustencilesDropdownList.innerHTML = "";

    list.ustensilsList.slice(0, 30).forEach((element) => {
      let span = document.createElement("span");

      span.textContent = element;
      ustencilesDropdownList.appendChild(span);
      span.addEventListener("click", function () {
        addTag(element, "#ED6454");
      });
    });
  }
}
function displayRecipes(list) {
  // console.info('displayRecipes')

  let wrapper = document.getElementById("recipes-wrapper");
  wrapper.innerHTML = ``;
  function getIngredients(recipe) {
    //console.info('getIngredients')

    let ingredientsDOM = document.createElement("ul");
    let number = 0;
    recipe.ingredients.forEach((ingredient) => {
      number++;
      let li = document.createElement("li");
      let span = document.createElement("span");

      span.textContent = `${
        ingredient.quantity ? ingredient.quantity : "Non spécifié"
      } ${ingredient.unit ? ingredient.unit : ""}`;
      li.textContent = ingredient.ingredient + ": ";
      li.appendChild(span);
      ingredientsDOM.appendChild(li);
    });

    return { ingredientsDOM, number };
  }
  list.forEach((recipe) => {
    let card = document.createElement("div");

    card.setAttribute("class", "recipe");
    card.innerHTML = `
            <div class="image"></div>
            <div class="content">
                <div class="name">${recipe.name}</div>
                <div class="duration">
                    <div class="icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="black"/>
                        </svg>
                    </div>
                    <p>${recipe.time} min</p>
                </div>
                <div class="ingredients">
                    ${getIngredients(recipe).ingredientsDOM.outerHTML}
                </div>
                <div class="description">
                    ${recipe.description}
                </div>
            </div>`;

    wrapper.appendChild(card);
  });
}
