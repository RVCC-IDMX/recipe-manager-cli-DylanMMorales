// recipe-display.js
// Functions for displaying and formatting recipes

// Import functions from other files
import { createRecipe, addIngredient, addStep } from './recipe-basics.js';

/* c8 ignore start */
// Set to true to see console examples when running this file directly
const SHOW_EXAMPLES = false;
/* c8 ignore stop */

/**
 * Calculates the cooking time per serving
 * Example of a concise arrow function with implicit return
 *
 * @param {object} recipe - The recipe to analyze
 * @returns {number} - Minutes per serving
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Function_body |MDN: Arrow functions with implicit return}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators |MDN: Arithmetic operators}
 */
const timePerServing = recipe => {
  return recipe.cookingTime / recipe.servings;
};

/**
 * Gets the numbered list of steps (demonstrates arrow function with block body)
 *
 * @param {object} recipe - The recipe to get steps from
 * @returns {string} - Formatted list of steps
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Function_body |MDN: Arrow functions with block body}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#for_statement |MDN: For loops}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals |MDN: Template literals}
 */
const getStepsList = (recipe) => {
  if (recipe.steps.length === 0) {
    return "No steps added yet";
  }

  let stepsString = '';
  recipe.steps.forEach((step, index) => {
    stepsString += `${index + 1}. ${step}\n`;
  });

  return stepsString.trim();
};

/**
 * Gets the formatted list of ingredients
 *
 * @param {object} recipe - The recipe to get ingredients from
 * @returns {string} - Formatted list of ingredients
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of |MDN: For...of loops}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals |MDN: Template literals}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length |MDN: Array.length property}
 */
const getIngredientsList = (recipe) => {
  if (recipe.ingredients.length === 0) {
    return "No ingredients added yet";
  }

  let ingredientsString = '';
  recipe.ingredients.forEach(ingredient => {
    ingredientsString += `- ${ingredient.amount} ${ingredient.unit} of ${ingredient.name}\n`;
  });

  return ingredientsString.trim();
};

/**
 * Displays recipe information as a string
 *
 * @param {object} recipe - Recipe to display
 * @returns {string} - Formatted recipe information
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals |MDN: Template literals for multi-line strings}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed |MDN: Number.toFixed() method}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim |MDN: String.trim() method}
 */
function formatRecipe(recipe) {
  return `
    Recipe: ${recipe.name}
    Servings: ${recipe.servings}
    Cooking time: ${recipe.cookingTime} minutes
    Time per serving: ${timePerServing(recipe).toFixed(1)} minutes  // Updated to lowercase "per" and "serving"
    for ${recipe.servings} people

    Ingredients:
    ${getIngredientsList(recipe)}

    Steps:
    ${getStepsList(recipe)}
  `.trim();
}

/* c8 ignore start */
// Example code - only runs when SHOW_EXAMPLES is true
if (SHOW_EXAMPLES) {
  console.log("=== Recipe Display Examples ===");

  // Create a recipe with ingredients and steps
  const omelet = createRecipe('Simple Omelet', 10, 1);
  addIngredient(omelet, 'Eggs', 2, 'large');
  addIngredient(omelet, 'Milk', 2, 'tbsp');
  addIngredient(omelet, 'Salt', 1, 'pinch');
  addIngredient(omelet, 'Butter', 1, 'tbsp');

  addStep(omelet, 'Beat eggs, milk, and salt together');
  addStep(omelet, 'Melt butter in pan over medium heat');
  addStep(omelet, 'Pour egg mixture into pan');
  addStep(omelet, 'Cook until bottom is set, then fold in half');
  addStep(omelet, 'Slide onto plate and serve');

  // Calculate time per serving
  console.log(`Time per serving: ${timePerServing(omelet)} minutes`);

  // Get formatted steps list
  console.log("Steps list:");
  console.log(getStepsList(omelet));

  // Get complete formatted recipe
  console.log("\nFormatted recipe:");
  console.log(formatRecipe(omelet));
}
/* c8 ignore stop */

// Export functions to be used in other files
export {
  timePerServing,
  getStepsList,
  getIngredientsList,
  formatRecipe
};
