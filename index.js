#!/usr/bin/env node
// src/index.js
// Main entry point for the recipe manager CLI

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  createRecipe,
  addIngredient,
  addStep,
  removeStep
} from './src/recipe-basics.js';
import {
  formatRecipe
} from './src/recipe-display.js';
import {
  promptForRecipeInfo,
  promptForIngredient,
  promptForStep,
  promptForStepIndex,
  promptForConfirmation
} from './src/cli/prompts.js';
import {
  displayRecipeList,
  displayRecipeDetails,
  displayFormattedRecipe,
  displaySuccess,
  displayError,
  displayWarning,
  displayInfo
} from './src/cli/display.js';
import {
  getRecipes,
  getRecipeById,
  createNewRecipe,
  updateExistingRecipe,
  deleteRecipe,
  getQuickRecipesList
} from './src/cli/command-wrapper.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

// CHALLENGE 6: Complete the yargs commands
// The commands are already set up, you just need to fill in some of the handlers

yargs(hideBin(process.argv))
  // List all recipes
  .command('list', 'List all recipes', () => {
    getRecipes(function (recipes) {
      displayRecipeList(recipes);
    });
  })

  // View details of a specific recipe
  .command('view <id>', 'View recipe details', (yargs) => {
    yargs.positional('id', {
      describe: 'Recipe ID',
      type: 'number'
    });
  }, (argv) => {
    getRecipeById(argv.id, function (recipe) {
      if (recipe) {
        displayRecipeDetails(recipe);
      }
    });
  })

  // View a formatted version of a recipe
  .command('format <id>', 'View formatted recipe', (yargs) => {
    yargs.positional('id', {
      describe: 'Recipe ID',
      type: 'number'
    });
  }, (argv) => {
    getRecipeById(argv.id, function (recipe) {
      if (recipe) {
        displayFormattedRecipe(recipe, formatRecipe);
      }
    });
  })

  // Create a new recipe
  .command('create', 'Create a new recipe', () => {
    // CHALLENGE 7: Implement recipe creation logic

    promptForRecipeInfo().then(function (recipeInfo) {
      const newRecipe = createRecipe(recipeInfo.name, recipeInfo.cookingTime, recipeInfo.servings);
      createNewRecipe(newRecipe);
      displaySuccess(`Recipe "${newRecipe.name}" created successfully!`);
    });
  })

  // Add an ingredient to a recipe
  .command('add-ingredient <id>', 'Add ingredient to a recipe', (yargs) => {
    yargs.positional('id', {
      describe: 'Recipe ID',
      type: 'number'
    });
  }, (argv) => {
    // CHALLENGE 8: Implement add ingredient logic

    getRecipeById(argv.id, function (recipe) {
      if (!recipe) {
        return;
      }

      promptForIngredient().then(function (ingredientInfo) {
        addIngredient(recipe, ingredientInfo.name, ingredientInfo.amount, ingredientInfo.unit);

        const successMessage = `Added ${ingredientInfo.name} to "${recipe.name}"`;
        updateExistingRecipe(recipe, successMessage);
      });
    });
  })

  // Add a step to a recipe
  .command('add-step <id>', 'Add step to a recipe', (yargs) => {
    yargs.positional('id', {
      describe: 'Recipe ID',
      type: 'number'
    });
  }, (argv) => {
    getRecipeById(argv.id, function (recipe) {
      if (!recipe) {
        return;
      }

      promptForStep().then(function (instruction) {
        addStep(recipe, instruction);

        const successMessage = `Added step ${recipe.steps.length} to "${recipe.name}"`;
        updateExistingRecipe(recipe, successMessage);
      });
    });
  })

  // Remove a step from a recipe
  .command('remove-step <id> [stepIndex]', 'Remove a step from a recipe', (yargs) => {
    yargs
      .positional('id', {
        describe: 'Recipe ID',
        type: 'number'
      })
      .positional('stepIndex', {
        describe: 'Step index to remove (1-based)',
        type: 'number'
      });
  }, (argv) => {
    getRecipeById(argv.id, function (recipe) {
      if (!recipe) {
        return;
      }

      if (recipe.steps.length === 0) {
        displayWarning('This recipe has no steps to remove');
        return;
      }

      let stepIndex = null;
      if (argv.stepIndex) {
        stepIndex = argv.stepIndex - 1;
      }

      if (stepIndex === null) {
        console.log(chalk.cyan('Current steps:'));
        recipe.steps.forEach(function (step, index) {
          console.log(`${index + 1}. ${step}`);
        });

        promptForStepIndex(recipe.steps.length - 1).then(function (index) {
          removeStep(recipe, index);

          const successMessage = `Removed step ${index + 1} from "${recipe.name}"`;
          updateExistingRecipe(recipe, successMessage);
        });
      } else {
        if (stepIndex < 0 || stepIndex >= recipe.steps.length) {
          displayWarning(`Invalid step index. Please use a number between 1 and ${recipe.steps.length}`);
          return;
        }

        removeStep(recipe, stepIndex);

        const successMessage = `Removed step ${stepIndex + 1} from "${recipe.name}"`;
        updateExistingRecipe(recipe, successMessage);
      }
    });
  })

  // Delete a recipe
  .command('delete <id>', 'Delete a recipe', (yargs) => {
    yargs.positional('id', {
      describe: 'Recipe ID',
      type: 'number'
    });
  }, (argv) => {
    getRecipeById(argv.id, function (recipe) {
      if (!recipe) {
        return;
      }

      promptForConfirmation(`Are you sure you want to delete "${recipe.name}"?`).then(function (confirmed) {
        if (!confirmed) {
          displayInfo('Delete cancelled');
          return;
        }

        deleteRecipe(argv.id, recipe.name);
      });
    });
  })

  // Find quick recipes
  .command('quick [time]', 'Find recipes that can be made quickly', (yargs) => {
    yargs.positional('time', {
      describe: 'Maximum cooking time in minutes',
      type: 'number',
      default: 30
    });
  }, (argv) => {
    // CHALLENGE 9: Implement quick recipes search

    getQuickRecipesList(argv.time, function (quickRecipes, maxTime) {
      if (quickRecipes.length > 0) {
        console.log(chalk.green(`Found ${quickRecipes.length} quick recipes under ${maxTime} minutes:`));
        quickRecipes.forEach(recipe => {
          console.log(`${recipe.name} - ${recipe.cookingTime} minutes`);
        });
      } else {
        displayWarning(`No quick recipes found under ${maxTime} minutes`);
      }
    });
  })

  // Reset recipe data to defaults
  .command('reset-data', 'Reset recipe data to defaults', () => {
    promptForConfirmation('Are you sure you want to reset all recipe data to defaults? This cannot be undone.').then(function (confirmed) {
      if (!confirmed) {
        displayInfo('Reset cancelled');
        return;
      }

      try {
        execSync('npm run reset-data', { stdio: 'inherit' });
        displaySuccess('Recipe data has been reset to defaults');
      } catch (error) {
        displayError(`Failed to reset data: ${error.message}`);
      }
    });
  })

  // Help and configuration
  .help()
  .alias('help', 'h')
  .demandCommand(1, 'You need to specify a command')
  .strict()
  .wrap(null)
  .epilog('For more information, check the README.md file')
  .argv;