const recipeInput = document.querySelector('#recipe-input');
const searchForm = document.querySelector('#search-form');
const recipeList = document.querySelector('#recipe-list .row');
const modalBody = document.querySelector('#recipe-details .modal-body');
const modalHeader = document.querySelector('.modal-header');

const getRecipes = async inputValue => {
  recipeList.innerHTML = '<p>Carregando receitas...</p>';
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
    );
    const recipeData = await response.json();

    addRecipesIntoDOM(recipeData);
  } catch (err) {
    console.error('Erro:', err);
  }
};

const createRecipeCard = recipe => `
  <div class="col-sm-12 col-md-6 col-lg-4 p-2">
     <div class="card">
        <img src="${recipe.strMealThumb}" class="recipe-img card-img-top" alt="${recipe.strMeal} imagem"> <!-- Alterado para PT-BR -->
         <div class="card-body">
           <h5 class="recipe-name card-title">${recipe.strMeal}</h5>
           <button type="submit" class="btn btn-custom show-recipe-btn" data-bs-toggle='modal' data-bs-target='#recipe-details'>Ver detalhes</button> <!-- Alterado para PT-BR -->
         </div>
     </div>
 </div>
`;

const showRecipeDetails = recipe => {
  let ingredients = '';

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient) {
      ingredients += `<li>${measure ? measure : ''} ${ingredient}</li>`;
    }
  }

  modalHeader.innerHTML = `
  <h5 class='modal-title'>${recipe.strMeal}</h5>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button> <!-- Alterado para PT-BR -->
  `;

  modalBody.innerHTML = `
  <p><strong>Categoria:</strong> ${recipe.strCategory}</p> <!-- Alterado para PT-BR -->
  <p><strong>Área:</strong> ${recipe.strArea}</p> <!-- Alterado para PT-BR -->
  <h6>Ingredientes:</h6>
  <ul>
  ${ingredients}
  </ul>
  <p>${recipe.strInstructions}</p> <!-- Alterado para PT-BR -->
  `;
};

const addRecipesIntoDOM = recipeData => {
  recipeList.innerHTML = '';

  const recipes = recipeData.meals;

  if (!recipes) {
    recipeList.innerHTML =
      '<p class="text-danger">Nenhuma receita encontrada.</p>';
    return;
  }

  recipeList.innerHTML = recipes.map(createRecipeCard).join('');
  const recipeButtons = document.querySelectorAll('.show-recipe-btn');

  recipeButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showRecipeDetails(recipes[index]);
    });
  });
};

searchForm.addEventListener('submit', event => {
  event.preventDefault();

  getRecipes(recipeInput.value);

  recipeInput.value = '';
});

getRecipes('');
