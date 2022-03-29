let filters = [];

function init() {
    let formatedFilters = [];
    if (getFilters()) {
        for (const el of verifyFilters(getFilters())) {
            if (el.valid == true) {
                filters.push(el)
                formatedFilters.push(el.name)
            }
        }
        if (formatedFilters.length == 0) {
            let url = new URL(document.location.href)
            window.history.pushState({ path: removeParam("filter", url.href) }, '', removeParam("filter", url.href));
        } else {
            changeUrl(formatedFilters)
        }
    } else {
        let url = new URL(document.location.href)
        window.history.pushState({ path: removeParam("filter", url.href) }, '', removeParam("filter", url.href));
    }

    let list;
    let recipeList = RECIPES

    if (filters.length > 0) {
        recipeList = [];
        let filterArr = Object.entries(filters)
        let filterTable = []
        for(let el of filterArr) {
            filterTable.push(el[1].name)
        }
        let totalRecipeTags = []
        for(let filterElement of filters) {
            let applianceList = getUtilsList().applianceList.filter(el => el != filterElement.name)
            let ustensilList = getUtilsList().ustensilList.filter(el => el != filterElement.name)
            let ingredientList = getUtilsList().ingredientList.filter(el => el != filterElement.name)
            list = ({ applianceList, ustensilList, ingredientList } )
        }
        for(let recipe of RECIPES) {
            let recipeTags = []
            recipeTags.push(normalizeStr(recipe.appliance))
            for(let ingredient of recipe.ingredients) {
                recipeTags.push(normalizeStr(ingredient.ingredient))
            }
            for(let ustensil of recipe.ustensils) {
                recipeTags.push(normalizeStr(ustensil))
            }
            let test = filterTable.every(element => {
                return recipeTags.includes(element)
            });
            if(test) {
                recipeList.push(recipe)
                for(let el of recipeTags) {
                    if(!totalRecipeTags.includes(el)) {
                        totalRecipeTags.push(el)
                    }
                }
            }
        }

        displayPage(filters, RECIPES, list)
    }
    else {
        displayPage(filters, RECIPES, getUtilsList())
    }

    let recipeList2 = searchRecipes('');
    refreshRecipeList(recipeList2)
    let tagList = getTagList(recipeList2)
    refreshDropdown(tagList) 
}
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}
function changeUrl(formatedFilters) {
    let filterParams = formatedFilters.join(',')
    let newUrl = new URL(document.location.href)
    newUrl.searchParams.set('filter', filterParams)
    window.history.pushState({ path: newUrl.href }, '', newUrl.href);
}
function normalizeStr(stringToNormalize) {
    var str = stringToNormalize.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>0123456789\{\}\[\]\\\/]/gi, '');
    str = str.replace(/[âà]/gi, 'a');
    str = str.replace(/[èéêë]/gi, 'e');
    str = str.replace(/[ç]/gi, 'c');
    str = str.replace(/[ïîì]/gi, 'i');
    str = str.replace(/[ôöò]/gi, 'o');
    str = str.replace(/[ûüù]/gi, 'u');
    str = str.replace(/[œ]/gi, 'oe');
    str = str.replace(/  +/g, ' ');

    return str.toLowerCase();
}
function getUtilsList() {
    let applianceList = []
    let ustensilList = []
    let ingredientList = []
    
    for(let recipe of RECIPES) {
        if(!applianceList.includes(normalizeStr(recipe.appliance))) {
            applianceList.push(normalizeStr(recipe.appliance))
        }
        for(let ustensil of recipe.ustensils) {
            if(!ustensilList.includes(normalizeStr(ustensil))) {
                ustensilList.push(normalizeStr(ustensil))
            }
        }
        for(let ingredient of recipe.ingredients) {
            if(!ingredientList.includes(normalizeStr(ingredient.ingredient))) {
                ingredientList.push(normalizeStr(ingredient.ingredient))
            }
        }
    }
    
    return { applianceList, ustensilList, ingredientList }
    
}
function getFilters() {
    let params = new URL(document.location.href).searchParams;
    let filter = params.get("filter");
    if(filter) {
        let filterList = [];
        for(let el of filter.split(',')) {
            let normalizedFilter = normalizeStr(el)
            filterList.push(normalizedFilter)
        }
        return filterList;
    }
}
function removeTag(tag) {
    let urlTags = verifyFilters(getFilters())
    let newUrlTag = []
    for(let el of urlTags) {
        if(el.name != tag.name) {
            newUrlTag.push(el.name)
        }
    }
    if(newUrlTag.length > 0) {
        changeUrl(newUrlTag)
    } else {
        let url = new URL(document.location.href)
        window.history.pushState({ path: removeParam("filter", url.href) }, '', removeParam("filter", url.href));
    }
    let mainInput = document.querySelectorAll('.searchbar')[0]
    filters = filters.filter(el => el.name != tag.name)
    let recipeList = searchRecipes(mainInput.value);
    update(recipeList)
}
function addTag(tag) {
    let formatedFilters = []
    let params = verifyFilters(getFilters());
    params.push(tag[0])
    for(let el of params) {
        if(el.valid == true) {
            formatedFilters.push(el.name)
        }
    }
    changeUrl(formatedFilters)
    refreshDropdown(formatedFilters) 
    let filterList = document.getElementsByClassName('filters')[0]
    filterList.innerHTML = ""
    for(let tag of params) {
        let tagElement = document.createElement('div');
        if(tag.category == "ingredient") {
            tagElement.setAttribute('class', 'tag blue');
        } else if(tag.category == "ustensil") {
            tagElement.setAttribute('class', 'tag red');
        } else if(tag.category == "appliance") {
            tagElement.setAttribute('class', 'tag green');
        }

        let tagElementName = document.createElement('span');
        tagElementName.innerText = tag.name;

        let close = document.createElement('div');
        close.setAttribute('class', 'icon');
        close.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"/>
            </svg> 
        `;
        close.addEventListener('click', () => {
            filterList.removeChild(tagElement)
            removeTag(tag)
        });
        filterList.appendChild(tagElement);
        tagElement.appendChild(tagElementName);
        tagElement.appendChild(close);
    }
    filters.push(...tag)
    let mainInput = document.querySelectorAll('.searchbar')[0]
    let recipeList = searchRecipes(mainInput.value);
    update(recipeList)
}
function verifyFilters(filterList) {
    let fullList = getUtilsList();
    let filterListVerified = [];
    if (filterList != undefined) {
        for(let filter of filterList) {
            if(fullList.applianceList.includes(filter)) {
                filterListVerified.push({
                    name: filter,
                    valid: true,
                    category: "appliance"
                });
            } else if(fullList.ustensilList.includes(filter)) {
                filterListVerified.push({
                    name: filter,
                    valid: true,
                    category: "ustensil"
                });
            } else if(fullList.ingredientList.includes(filter)) {
                filterListVerified.push({
                    name: filter,
                    valid: true,
                    category: "ingredient"
                });
            } else {
                filterListVerified.push({
                    name: filter,
                    valid: false,
                    category: "unknown"
                });
            }
        }
    }
    
    return filterListVerified
}
function refreshDropdown(dropdowns) { 
    function displayDropdown(list) {
        let dropdownList = document.getElementsByClassName('dropdown-list')[0]
        dropdownList.innerHTML = '';
        for(let i = 0; i<3; i++) {
            let item = document.createElement('div')
            let dropdown = document.createElement('div')
            let dropdownTop = document.createElement('div')
            let dropdownTopInput = document.createElement('input')
            let dropdownTopIcon = document.createElement('div')
            let dropdownInner = document.createElement('div')
    

            dropdownTopInput.addEventListener('input', (e) => {
                let value = normalizeStr(e.target.value.toLowerCase());
                updateDropdownsList(searchDropdown(value,i))
            })

            dropdownTop.setAttribute('class', 'top')
            dropdownTopInput.setAttribute('type', 'text')
            dropdownTopIcon.setAttribute('class', 'icon')
            dropdownTopIcon.innerHTML = `
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.12 0.453369L8 6.56004L1.88 0.453369L0 2.33337L8 10.3334L16 2.33337L14.12 0.453369Z" fill="white"/>
                </svg>
            `
            dropdownInner.setAttribute('class', 'inner')
            if(i == 0) { // Ingrédients
                dropdown.setAttribute('class', 'dropdown blue')
                dropdownTopInput.setAttribute('placeholder', 'Ingredients')
                dropdownTopInput.setAttribute('aria-label', 'Rechercher un ingrédient')
                dropdownTopInput.setAttribute('id', 'ingredient')
                dropdownInner.setAttribute('id', 'dropdownInnerIngredient')
                for(let ingredient of list.ingredientList) {
                    let ingredientElement = document.createElement('span')
                    ingredientElement.innerText = ingredient;
                    dropdownInner.appendChild(ingredientElement)
                    ingredientElement.addEventListener('click', () => {
                        addTag(verifyFilters([ingredient]))
                    })
                }
            } else if(i == 1) { // Appareils
                dropdown.setAttribute('class', 'dropdown green')
                dropdownTopInput.setAttribute('placeholder', 'Appareils')
                dropdownTopInput.setAttribute('aria-label', 'Rechercher un appareil')
                dropdownTopInput.setAttribute('id', 'appareil')
                dropdownInner.setAttribute('id', 'dropdownInnerAppareil')
                for(let appliance of list.applianceList) {
                    let applianceElement = document.createElement('span')
                    applianceElement.innerText = appliance;
                    dropdownInner.appendChild(applianceElement)
                    applianceElement.addEventListener('click', () => {
                        addTag(verifyFilters([appliance]))
                    })
                }
            } else if(i == 2) { // Ustenciles
                dropdown.setAttribute('class', 'dropdown red')
                dropdownTopInput.setAttribute('placeholder', 'Ustenciles')
                dropdownTopInput.setAttribute('aria-label', 'Rechercher un ustencile')
                dropdownTopInput.setAttribute('id', 'ustencile')
                dropdownInner.setAttribute('id', 'dropdownInnerUstencile')
                for(let ustencil of list.ustensilList) {
                    let ustencilElement = document.createElement('span')
                    ustencilElement.innerText = ustencil;
                    dropdownInner.appendChild(ustencilElement)
                    ustencilElement.addEventListener('click', () => {
                        addTag(verifyFilters([ustencil]))
                    })
                }
            }
    
            item.setAttribute('class', 'item')
            item.appendChild(dropdown)
            dropdown.appendChild(dropdownTop)
            dropdownTop.appendChild(dropdownTopInput)
            dropdownTop.appendChild(dropdownTopIcon)
            dropdown.appendChild(dropdownInner)
    
            dropdownList.appendChild(item)
        }
    }
    if(dropdowns == undefined) {
        displayDropdown(getUtilsList())
    } else if (dropdowns.length > 0) {
        let applianceList = getUtilsList().applianceList.filter(el => !dropdowns.includes(el))
        let ustensilList = getUtilsList().ustensilList.filter(el => !dropdowns.includes(el))
        let ingredientList = getUtilsList().ingredientList.filter(el => !dropdowns.includes(el))
        displayDropdown({applianceList, ustensilList, ingredientList})
    }
    else {
        displayDropdown(getUtilsList())
    }
}
function displayPage(tags, recipes, dropdowns) {
    /**
     * Page
     */
    let page = document.getElementById('app');
    page.innerHTML = "";

    /**
     * Navbar
     */
    let navbar = document.createElement('div');
    navbar.setAttribute('class', 'navbar');
    navbar.innerHTML = `
            <div class="logo">
                <svg width="52" height="47" viewBox="0 0 52 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M39.5083 25.3424V35.1415H12.4024V25.3424C7.99768 25.3424 4.60945 21.9635 4.60945 17.5708C4.60945 13.1781 7.99768 9.79908 12.4024 9.79908C15.4518 9.79908 18.1624 11.4886 19.5177 14.1918L22.9059 12.5023C21.8895 10.8128 20.873 9.12328 19.1789 8.10958C20.5342 5.74429 22.9059 4.05479 25.9553 4.05479C30.36 4.05479 33.7483 7.43378 33.7483 11.8265C33.7483 13.1781 33.4095 14.5297 32.7318 15.8813L36.12 17.9087C37.1365 16.2192 37.8142 14.1918 37.8142 11.8265C37.8142 11.1507 37.8142 10.8128 37.8142 10.137C38.4918 9.79908 39.1695 9.79908 39.8471 9.79908C44.2518 9.79908 47.64 13.1781 47.64 17.5708C47.64 21.9635 43.913 25.3424 39.5083 25.3424ZM39.5083 42.9132H12.4024V39.1963H39.5083V42.9132ZM39.5083 6.08219C38.4918 6.08219 37.4753 6.42009 36.12 6.42009C34.0871 2.70319 30.36 0 25.9553 0C21.5506 0 17.4847 2.36529 15.7906 6.42009C14.7742 6.08219 13.7577 6.08219 12.4024 6.08219C5.96474 6.08219 0.882385 11.1507 0.882385 17.5708C0.882385 22.6393 4.27062 27.0319 8.67533 28.3835V46.2922H43.5742V28.7214C47.9789 27.0319 51.3671 22.9772 51.3671 17.9087C51.3671 11.4886 45.9459 6.08219 39.5083 6.08219ZM22.2283 31.0867H18.5012V23.653H22.2283V31.0867ZM33.7483 31.0867H30.0212V23.653H33.7483V31.0867Z" fill="#D04F4F"/>
                </svg>
                <div class="text">
                    <svg width="265" height="34" viewBox="0 0 265 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.696047 26V0.799998H5.30405V22.4H16.464V26H0.696047ZM28.2836 26.432C26.4836 26.432 24.8876 26.048 23.4956 25.28C22.1036 24.512 21.0116 23.432 20.2196 22.04C19.4276 20.648 19.0316 19.04 19.0316 17.216C19.0316 15.368 19.4156 13.724 20.1836 12.284C20.9756 10.844 22.0556 9.728 23.4236 8.936C24.8156 8.12 26.4476 7.712 28.3196 7.712C30.0716 7.712 31.6196 8.096 32.9636 8.864C34.3076 9.632 35.3516 10.688 36.0956 12.032C36.8636 13.352 37.2476 14.828 37.2476 16.46C37.2476 16.724 37.2356 17 37.2116 17.288C37.2116 17.576 37.1996 17.876 37.1756 18.188H23.6036C23.6996 19.58 24.1796 20.672 25.0436 21.464C25.9316 22.256 26.9996 22.652 28.2476 22.652C29.1836 22.652 29.9636 22.448 30.5876 22.04C31.2356 21.608 31.7156 21.056 32.0276 20.384H36.7076C36.3716 21.512 35.8076 22.544 35.0156 23.48C34.2476 24.392 33.2876 25.112 32.1356 25.64C31.0076 26.168 29.7236 26.432 28.2836 26.432ZM28.3196 11.456C27.1916 11.456 26.1956 11.78 25.3316 12.428C24.4676 13.052 23.9156 14.012 23.6756 15.308H32.5676C32.4956 14.132 32.0636 13.196 31.2716 12.5C30.4796 11.804 29.4956 11.456 28.3196 11.456ZM48.5032 26.432C46.9192 26.432 45.5272 26.18 44.3272 25.676C43.1272 25.148 42.1672 24.428 41.4472 23.516C40.7272 22.604 40.2952 21.548 40.1512 20.348H44.7952C44.9392 21.044 45.3232 21.644 45.9472 22.148C46.5952 22.628 47.4232 22.868 48.4312 22.868C49.4392 22.868 50.1712 22.664 50.6272 22.256C51.1072 21.848 51.3472 21.38 51.3472 20.852C51.3472 20.084 51.0112 19.568 50.3392 19.304C49.6672 19.016 48.7312 18.74 47.5312 18.476C46.7632 18.308 45.9832 18.104 45.1912 17.864C44.3992 17.624 43.6672 17.324 42.9952 16.964C42.3472 16.58 41.8192 16.1 41.4112 15.524C41.0032 14.924 40.7992 14.192 40.7992 13.328C40.7992 11.744 41.4232 10.412 42.6712 9.332C43.9432 8.252 45.7192 7.712 47.9992 7.712C50.1112 7.712 51.7912 8.204 53.0392 9.188C54.3112 10.172 55.0672 11.528 55.3072 13.256H50.9512C50.6872 11.936 49.6912 11.276 47.9632 11.276C47.0992 11.276 46.4272 11.444 45.9472 11.78C45.4912 12.116 45.2632 12.536 45.2632 13.04C45.2632 13.568 45.6112 13.988 46.3072 14.3C47.0032 14.612 47.9272 14.9 49.0792 15.164C50.3272 15.452 51.4672 15.776 52.4992 16.136C53.5552 16.472 54.3952 16.988 55.0192 17.684C55.6432 18.356 55.9552 19.328 55.9552 20.6C55.9792 21.704 55.6912 22.7 55.0912 23.588C54.4912 24.476 53.6272 25.172 52.4992 25.676C51.3712 26.18 50.0392 26.432 48.5032 26.432ZM68.6154 33.92V8.144H72.7194L73.2234 10.7C73.7994 9.908 74.5554 9.212 75.4914 8.612C76.4514 8.012 77.6874 7.712 79.1994 7.712C80.8794 7.712 82.3794 8.12 83.6994 8.936C85.0194 9.752 86.0634 10.868 86.8314 12.284C87.5994 13.7 87.9834 15.308 87.9834 17.108C87.9834 18.908 87.5994 20.516 86.8314 21.932C86.0634 23.324 85.0194 24.428 83.6994 25.244C82.3794 26.036 80.8794 26.432 79.1994 26.432C77.8554 26.432 76.6794 26.18 75.6714 25.676C74.6634 25.172 73.8474 24.464 73.2234 23.552V33.92H68.6154ZM78.2274 22.4C79.6914 22.4 80.9034 21.908 81.8634 20.924C82.8234 19.94 83.3034 18.668 83.3034 17.108C83.3034 15.548 82.8234 14.264 81.8634 13.256C80.9034 12.248 79.6914 11.744 78.2274 11.744C76.7394 11.744 75.5154 12.248 74.5554 13.256C73.6194 14.24 73.1514 15.512 73.1514 17.072C73.1514 18.632 73.6194 19.916 74.5554 20.924C75.5154 21.908 76.7394 22.4 78.2274 22.4ZM100.776 26.432C98.9758 26.432 97.3798 26.048 95.9878 25.28C94.5958 24.512 93.5038 23.432 92.7118 22.04C91.9198 20.648 91.5238 19.04 91.5238 17.216C91.5238 15.368 91.9078 13.724 92.6758 12.284C93.4678 10.844 94.5478 9.728 95.9158 8.936C97.3078 8.12 98.9398 7.712 100.812 7.712C102.564 7.712 104.112 8.096 105.456 8.864C106.8 9.632 107.844 10.688 108.588 12.032C109.356 13.352 109.74 14.828 109.74 16.46C109.74 16.724 109.728 17 109.704 17.288C109.704 17.576 109.692 17.876 109.668 18.188H96.0958C96.1918 19.58 96.6718 20.672 97.5358 21.464C98.4238 22.256 99.4918 22.652 100.74 22.652C101.676 22.652 102.456 22.448 103.08 22.04C103.728 21.608 104.208 21.056 104.52 20.384H109.2C108.864 21.512 108.3 22.544 107.508 23.48C106.74 24.392 105.78 25.112 104.628 25.64C103.5 26.168 102.216 26.432 100.776 26.432ZM100.812 11.456C99.6838 11.456 98.6878 11.78 97.8238 12.428C96.9598 13.052 96.4078 14.012 96.1678 15.308H105.06C104.988 14.132 104.556 13.196 103.764 12.5C102.972 11.804 101.988 11.456 100.812 11.456ZM121.255 26C119.383 26 117.883 25.544 116.755 24.632C115.627 23.72 115.063 22.1 115.063 19.772V11.996H112.003V8.144H115.063L115.603 3.356H119.671V8.144H124.495V11.996H119.671V19.808C119.671 20.672 119.851 21.272 120.211 21.608C120.595 21.92 121.243 22.076 122.155 22.076H124.387V26H121.255ZM130.935 5.372C130.095 5.372 129.399 5.12 128.847 4.616C128.319 4.112 128.055 3.476 128.055 2.708C128.055 1.94 128.319 1.316 128.847 0.835998C129.399 0.331999 130.095 0.079999 130.935 0.079999C131.775 0.079999 132.459 0.331999 132.987 0.835998C133.539 1.316 133.815 1.94 133.815 2.708C133.815 3.476 133.539 4.112 132.987 4.616C132.459 5.12 131.775 5.372 130.935 5.372ZM128.631 26V8.144H133.239V26H128.631ZM146.005 26C144.133 26 142.633 25.544 141.505 24.632C140.377 23.72 139.813 22.1 139.813 19.772V11.996H136.753V8.144H139.813L140.353 3.356H144.421V8.144H149.245V11.996H144.421V19.808C144.421 20.672 144.601 21.272 144.961 21.608C145.345 21.92 145.993 22.076 146.905 22.076H149.137V26H146.005ZM160.581 26.432C158.997 26.432 157.605 26.18 156.405 25.676C155.205 25.148 154.245 24.428 153.525 23.516C152.805 22.604 152.373 21.548 152.229 20.348H156.873C157.017 21.044 157.401 21.644 158.025 22.148C158.673 22.628 159.501 22.868 160.509 22.868C161.517 22.868 162.249 22.664 162.705 22.256C163.185 21.848 163.425 21.38 163.425 20.852C163.425 20.084 163.089 19.568 162.417 19.304C161.745 19.016 160.809 18.74 159.609 18.476C158.841 18.308 158.061 18.104 157.269 17.864C156.477 17.624 155.745 17.324 155.073 16.964C154.425 16.58 153.897 16.1 153.489 15.524C153.081 14.924 152.877 14.192 152.877 13.328C152.877 11.744 153.501 10.412 154.749 9.332C156.021 8.252 157.797 7.712 160.077 7.712C162.189 7.712 163.869 8.204 165.117 9.188C166.389 10.172 167.145 11.528 167.385 13.256H163.029C162.765 11.936 161.769 11.276 160.041 11.276C159.177 11.276 158.505 11.444 158.025 11.78C157.569 12.116 157.341 12.536 157.341 13.04C157.341 13.568 157.689 13.988 158.385 14.3C159.081 14.612 160.005 14.9 161.157 15.164C162.405 15.452 163.545 15.776 164.577 16.136C165.633 16.472 166.473 16.988 167.097 17.684C167.721 18.356 168.033 19.328 168.033 20.6C168.057 21.704 167.769 22.7 167.169 23.588C166.569 24.476 165.705 25.172 164.577 25.676C163.449 26.18 162.117 26.432 160.581 26.432ZM180.694 33.92V8.144H184.798L185.302 10.7C185.878 9.908 186.634 9.212 187.57 8.612C188.53 8.012 189.766 7.712 191.278 7.712C192.958 7.712 194.458 8.12 195.778 8.936C197.098 9.752 198.142 10.868 198.91 12.284C199.678 13.7 200.062 15.308 200.062 17.108C200.062 18.908 199.678 20.516 198.91 21.932C198.142 23.324 197.098 24.428 195.778 25.244C194.458 26.036 192.958 26.432 191.278 26.432C189.934 26.432 188.758 26.18 187.75 25.676C186.742 25.172 185.926 24.464 185.302 23.552V33.92H180.694ZM190.306 22.4C191.77 22.4 192.982 21.908 193.942 20.924C194.902 19.94 195.382 18.668 195.382 17.108C195.382 15.548 194.902 14.264 193.942 13.256C192.982 12.248 191.77 11.744 190.306 11.744C188.818 11.744 187.594 12.248 186.634 13.256C185.698 14.24 185.23 15.512 185.23 17.072C185.23 18.632 185.698 19.916 186.634 20.924C187.594 21.908 188.818 22.4 190.306 22.4ZM204.178 26V0.079999H208.786V26H204.178ZM219.65 26.432C218.114 26.432 216.854 26.192 215.87 25.712C214.886 25.208 214.154 24.548 213.674 23.732C213.194 22.916 212.954 22.016 212.954 21.032C212.954 19.376 213.602 18.032 214.898 17C216.194 15.968 218.138 15.452 220.73 15.452H225.266V15.02C225.266 13.796 224.918 12.896 224.222 12.32C223.526 11.744 222.662 11.456 221.63 11.456C220.694 11.456 219.878 11.684 219.182 12.14C218.486 12.572 218.054 13.22 217.886 14.084H213.386C213.506 12.788 213.938 11.66 214.682 10.7C215.45 9.74 216.434 9.008 217.634 8.504C218.834 7.976 220.178 7.712 221.666 7.712C224.21 7.712 226.214 8.348 227.678 9.62C229.142 10.892 229.874 12.692 229.874 15.02V26H225.95L225.518 23.12C224.99 24.08 224.246 24.872 223.286 25.496C222.35 26.12 221.138 26.432 219.65 26.432ZM220.694 22.832C222.014 22.832 223.034 22.4 223.754 21.536C224.498 20.672 224.966 19.604 225.158 18.332H221.234C220.01 18.332 219.134 18.56 218.606 19.016C218.078 19.448 217.814 19.988 217.814 20.636C217.814 21.332 218.078 21.872 218.606 22.256C219.134 22.64 219.83 22.832 220.694 22.832ZM241.982 26C240.11 26 238.61 25.544 237.482 24.632C236.354 23.72 235.79 22.1 235.79 19.772V11.996H232.73V8.144H235.79L236.33 3.356H240.398V8.144H245.222V11.996H240.398V19.808C240.398 20.672 240.578 21.272 240.938 21.608C241.322 21.92 241.97 22.076 242.882 22.076H245.114V26H241.982ZM256.558 26.432C254.974 26.432 253.582 26.18 252.382 25.676C251.182 25.148 250.222 24.428 249.502 23.516C248.782 22.604 248.35 21.548 248.206 20.348H252.85C252.994 21.044 253.378 21.644 254.002 22.148C254.65 22.628 255.478 22.868 256.486 22.868C257.494 22.868 258.226 22.664 258.682 22.256C259.162 21.848 259.402 21.38 259.402 20.852C259.402 20.084 259.066 19.568 258.394 19.304C257.722 19.016 256.786 18.74 255.586 18.476C254.818 18.308 254.038 18.104 253.246 17.864C252.454 17.624 251.722 17.324 251.05 16.964C250.402 16.58 249.874 16.1 249.466 15.524C249.058 14.924 248.854 14.192 248.854 13.328C248.854 11.744 249.478 10.412 250.726 9.332C251.998 8.252 253.774 7.712 256.054 7.712C258.166 7.712 259.846 8.204 261.094 9.188C262.366 10.172 263.122 11.528 263.362 13.256H259.006C258.742 11.936 257.746 11.276 256.018 11.276C255.154 11.276 254.482 11.444 254.002 11.78C253.546 12.116 253.318 12.536 253.318 13.04C253.318 13.568 253.666 13.988 254.362 14.3C255.058 14.612 255.982 14.9 257.134 15.164C258.382 15.452 259.522 15.776 260.554 16.136C261.61 16.472 262.45 16.988 263.074 17.684C263.698 18.356 264.01 19.328 264.01 20.6C264.034 21.704 263.746 22.7 263.146 23.588C262.546 24.476 261.682 25.172 260.554 25.676C259.426 26.18 258.094 26.432 256.558 26.432Z" fill="#D04F4F"/>
                    </svg>
                </div>
            </div>
    `;
    /**
     * SearchBar
     */
    let searchbar = document.createElement('div');
    let searchbarInput = document.createElement('input');
    let searchbarIcon = document.createElement('div');

    searchbarInput.setAttribute('type', 'text')
    searchbarInput.setAttribute('class', 'searchbar')
    searchbarInput.setAttribute('placeholder', 'Rechercher une recette')
    searchbarInput.addEventListener('input', (e) => {
        let value = normalizeStr(e.target.value.toLowerCase());
        let recipeList = searchRecipes(value);
        refreshRecipeList(recipeList)
        let tagList = getTagList(recipeList)
        refreshDropdown(tagList)
    })

    searchbarIcon.setAttribute('class', 'icon')

    searchbar.setAttribute('class', 'search-tab');
    searchbar.appendChild(searchbarInput)
    searchbar.appendChild(searchbarIcon)
    searchbarIcon.innerHTML = `
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.4167 20.6667H21.9683L21.455 20.1717C23.2517 18.0817 24.3333 15.3683 24.3333 12.4167C24.3333 5.835 18.9983 0.5 12.4167 0.5C5.835 0.5 0.5 5.835 0.5 12.4167C0.5 18.9983 5.835 24.3333 12.4167 24.3333C15.3683 24.3333 18.0817 23.2517 20.1717 21.455L20.6667 21.9683V23.4167L29.8333 32.565L32.565 29.8333L23.4167 20.6667ZM12.4167 20.6667C7.85167 20.6667 4.16667 16.9817 4.16667 12.4167C4.16667 7.85167 7.85167 4.16667 12.4167 4.16667C16.9817 4.16667 20.6667 7.85167 20.6667 12.4167C20.6667 16.9817 16.9817 20.6667 12.4167 20.6667Z" fill="black"/>
    </svg>
    `
    /**
     * FilterList
     */
    let filterList = document.createElement('div')
    filterList.setAttribute('class', 'filters') 
    for(let tag of tags) {
        let tagElement = document.createElement('div');
        if(tag.category == "ingredient") {
            tagElement.setAttribute('class', 'tag blue');
        } else if(tag.category == "ustensil") {
            tagElement.setAttribute('class', 'tag red');
        } else if(tag.category == "appliance") {
            tagElement.setAttribute('class', 'tag green');
        }

        let tagElementName = document.createElement('span');
        tagElementName.innerText = tag.name;

        let close = document.createElement('div');
        close.setAttribute('class', 'icon');
        close.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"/>
            </svg> 
        `;
        close.addEventListener('click', () => {
            filterList.removeChild(tagElement)
            removeTag(tag)
        });

        filterList.appendChild(tagElement);
        tagElement.appendChild(tagElementName);
        tagElement.appendChild(close);
    }
    /**
     * Dropdowns
     */

    let dropdownList = document.createElement('div')
    dropdownList.setAttribute('class', 'dropdown-list')
    
    for(let i = 0; i<3; i++) {
        let item = document.createElement('div')
        let dropdown = document.createElement('div')
        let dropdownTop = document.createElement('div')
        let dropdownTopInput = document.createElement('input')
        let dropdownTopIcon = document.createElement('div')
        let dropdownInner = document.createElement('div')

        dropdownTop.setAttribute('class', 'top')
        dropdownTopInput.setAttribute('type', 'text')
        dropdownTopInput.addEventListener('input', (e) => {
            let value = normalizeStr(e.target.value.toLowerCase());
            updateDropdownsList(searchDropdown(value,i))
        })
        
        dropdownTopIcon.setAttribute('class', 'icon')
        dropdownTopIcon.innerHTML = `
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.12 0.453369L8 6.56004L1.88 0.453369L0 2.33337L8 10.3334L16 2.33337L14.12 0.453369Z" fill="white"/>
            </svg>
        `
        dropdownInner.setAttribute('class', 'inner')
        if(i == 0) { // Ingrédients
            dropdown.setAttribute('class', 'dropdown blue')
            dropdownTopInput.setAttribute('placeholder', 'Ingredients')
            dropdownTopInput.setAttribute('aria-label', 'Rechercher un ingrédient')
            dropdownTopInput.setAttribute('id', 'ingredient')
            dropdownInner.setAttribute('id', 'dropdownInnerIngredient')
            for(let ingredient of dropdowns.ingredientList) {
                let ingredientElement = document.createElement('span')
                ingredientElement.innerText = ingredient;
                dropdownInner.appendChild(ingredientElement)
                ingredientElement.addEventListener('click', () => {
                    addTag(verifyFilters([ingredient]))
                })
            }
        } else if(i == 1) { // Appareils
            dropdown.setAttribute('class', 'dropdown green')
            dropdownTopInput.setAttribute('placeholder', 'Appareils')
            dropdownTopInput.setAttribute('aria-label', 'Rechercher un appareil')
            dropdownTopInput.setAttribute('id', 'appareil')
            dropdownInner.setAttribute('id', 'dropdownInnerAppareil')
            for(let appliance of dropdowns.applianceList) {
                let applianceElement = document.createElement('span')
                applianceElement.innerText = appliance;
                dropdownInner.appendChild(applianceElement)
                applianceElement.addEventListener('click', () => {
                    addTag(verifyFilters([appliance]))
                })
            }
        } else if(i == 2) { // Ustenciles
            dropdown.setAttribute('class', 'dropdown red')
            dropdownTopInput.setAttribute('placeholder', 'Ustenciles')
            dropdownTopInput.setAttribute('aria-label', 'Rechercher un ustencile')
            dropdownTopInput.setAttribute('id', 'ustencile')
            dropdownInner.setAttribute('id', 'dropdownInnerUstencile')
            for(let ustencil of dropdowns.ustensilList) {
                let ustencilElement = document.createElement('span')
                ustencilElement.innerText = ustencil;
                dropdownInner.appendChild(ustencilElement)
                ustencilElement.addEventListener('click', () => {
                    addTag(verifyFilters([ustencil]))
                })
            }
        }
        item.setAttribute('class', 'item')
        item.appendChild(dropdown)
        dropdown.appendChild(dropdownTop)
        dropdownTop.appendChild(dropdownTopInput)
        dropdownTop.appendChild(dropdownTopIcon)
        dropdown.appendChild(dropdownInner)

        dropdownList.appendChild(item)
    }
    
    /**
     * Recipes
     */
    let recipeList = document.createElement('div')
    recipeList.setAttribute('class','recipes-wrapper')
    recipeList.setAttribute('id','recipes-wrapper')
    //! Cards
    function getIngredients(recipe) {
        let ingredientsDOM = document.createElement("ul");
        let number = 0;
        for(let ingredient of recipe.ingredients) {
            number++;
            let li = document.createElement("li");
            let span = document.createElement("span");
    
            span.textContent = `${
                ingredient.quantity ? ingredient.quantity : "Non spécifié"
            } ${ingredient.unit ? ingredient.unit : ""}`;
            li.textContent = ingredient.ingredient + ": ";
            li.appendChild(span);
            ingredientsDOM.appendChild(li);
        }
        return { ingredientsDOM, number };
    }
    for(let recipe of recipes) {
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
    
        recipeList.appendChild(card);
    }
    /**
     * Append element to the page
     */
    page.appendChild(navbar);
    page.appendChild(searchbar);
    page.appendChild(filterList);
    page.appendChild(dropdownList);
    page.appendChild(recipeList);
}
function searchRecipes(value) {
    let list = []
    if (filters.length > 0) {
        for(let recipe of RECIPES) {
            let fullTagsList = [];
            if(fullTagsList.includes(normalizeStr(recipe.appliance)) != true) {
                fullTagsList.push(normalizeStr(recipe.appliance))
            }
            for(let ingredient of recipe.ingredients) {
                if(fullTagsList.includes(normalizeStr(ingredient.ingredient)) != true) {
                    fullTagsList.push(normalizeStr(ingredient.ingredient))
                }
            }
            for(let ustencil of recipe.ustensils) {
                if(fullTagsList.includes(normalizeStr(ustensil)) != true) {
                    fullTagsList.push(normalizeStr(ustensil))
                }
            }
            let filterList = []
            for(let filter of filters) {
                filterList.push(normalizeStr(filter.name))
            }
            if(!list.includes(recipe)) {
                if(filterList.every(el => fullTagsList.includes(el))) {
                    list.push(recipe)
                }
            }
        }
    } else {
        for(let recipe of RECIPES) {
            if(!list.includes(recipe)) {
                if(normalizeStr(recipe.name).includes(value)) list.push(recipe)
                if(normalizeStr(recipe.description).includes(value)) list.push(recipe)
                if(normalizeStr(recipe.appliance).includes(value)) list.push(recipe)
                for(let ingredient of recipe.ingredients) {
                    if(normalizeStr(ingredient.ingredient).includes(value)) list.push(recipe)
                }
            }
        }
    }
    
    return list
}
function refreshRecipeList(recipes) {
    let recipeList = document.getElementById('recipes-wrapper')
    recipeList.innerHTML = '';

    function getIngredients(recipe) {
        let ingredientsDOM = document.createElement("ul");
        let number = 0;
        for (let ingredient of recipe.ingredients) {
            number++;
            let li = document.createElement("li");
            let span = document.createElement("span");
    
            span.textContent = `${
                ingredient.quantity ? ingredient.quantity : "Non spécifié"
            } ${ingredient.unit ? ingredient.unit : ""}`;
            li.textContent = ingredient.ingredient + ": ";
            li.appendChild(span);
            ingredientsDOM.appendChild(li);
        }
        return { ingredientsDOM, number };
    }
    for(let recipe of recipes) {
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
        recipeList.appendChild(card);
    }
}
function getTagList(value) {
    let tagList = [];
    for(let recipe of value) {
        if(!tagList.includes(normalizeStr(recipe.appliance))) {
            tagList.push(normalizeStr(recipe.appliance))
        }
        for(let el of recipe.ustensils) {
            if(!tagList.includes(normalizeStr(el))) {
                tagList.push(normalizeStr(el))
            }
        }
        for(let el of recipe.ingredients) {
            if(!tagList.includes(normalizeStr(el.ingredient))) {
                tagList.push(normalizeStr(el.ingredient))
            }
        }
    }
    let finalList = []
    
    if(filters.length > 0) {
        for(let filter of filters) {
            let tagListFiltered = tagList.filter(tag => tag != filter.name)
            if(tagList.includes(filter.name)) {
                let applianceList = getUtilsList().applianceList.filter((item) => !tagListFiltered.includes(item))
                let ustensilList = getUtilsList().ustensilList.filter((item) => !tagListFiltered.includes(item))
                let ingredientList = getUtilsList().ingredientList.filter((item) => !tagListFiltered.includes(item))
                finalList.push(...applianceList)
                finalList.push(...ustensilList)
                finalList.push(...ingredientList)
            }
        }
    } else {
        let applianceList = getUtilsList().applianceList.filter((item) => !tagList.includes(item))
        let ustensilList = getUtilsList().ustensilList.filter((item) => !tagList.includes(item))
        let ingredientList = getUtilsList().ingredientList.filter((item) => !tagList.includes(item))
        finalList.push(...applianceList)
        finalList.push(...ustensilList)
        finalList.push(...ingredientList)
    }
    return finalList
}

function searchDropdown(value, index) {
    let filtered;
    if(index == 0) {
        filtered = getUtilsList().ingredientList.filter(el => el.includes(value))
    } else if(index == 1) {
        filtered = getUtilsList().applianceList.filter(el => el.includes(value))
    }else if(index == 2) {
        filtered = getUtilsList().ustensilList.filter(el => el.includes(value))
    }
    return { filtered,index} 
}
function updateDropdownsList(value) {
    let arrayToDisplay = value.filtered;
    let index = value.index
    if(index == 0) {
        let ingredientListDOM = document.getElementById('dropdownInnerIngredient')
        ingredientListDOM.innerHTML = ""
        for(let el of arrayToDisplay) {
            let span = document.createElement('span')
            span.innerText = el
            ingredientListDOM.appendChild(span)
            span.addEventListener('click', () => {
                addTag(verifyFilters([el]))
            })
        }
    } else if(index == 1) {
    let appareilListDOM = document.getElementById('dropdownInnerAppareil')
        appareilListDOM.innerHTML = ""
        for(let el of arrayToDisplay) {
            let span = document.createElement('span')
            span.innerText = el
            appareilListDOM.appendChild(span)
        }
    } else if(index == 2) {
        let ustencileListDOM = document.getElementById('dropdownInnerUstencile')
        ustencileListDOM.innerHTML = ""
        for(let el of arrayToDisplay) {
            let span = document.createElement('span')
            span.innerText = el
            ustencileListDOM.appendChild(span)
        }
    } else if(index == 3) {
        let applianceList = value.applianceList;
        let ingredientList = value.ingredientList;
        let ustensilList = value.ustensilList;
        let ustencileListDOM = document.getElementById('dropdownInnerUstencile')
        ustencileListDOM.innerHTML = ""
        for(let el of ustensilList) {
            let span = document.createElement('span')
            span.innerText = el
            ustencileListDOM.appendChild(span)
        }
        let appareilListDOM = document.getElementById('dropdownInnerAppareil')
        appareilListDOM.innerHTML = ""
        for(let el of applianceList) {
            let span = document.createElement('span')
            span.innerText = el
            appareilListDOM.appendChild(span)
        }
        let ingredientListDOM = document.getElementById('dropdownInnerIngredient')
        ingredientListDOM.innerHTML = ""
        for(let el of ingredientList) {
            let span = document.createElement('span')
            span.innerText = el
            ingredientListDOM.appendChild(span)
        }
    }
}

function update(recipeList) {
    refreshRecipeList(recipeList)
    let tagList = getTagList(recipeList)
    refreshDropdown(tagList)
}


init()