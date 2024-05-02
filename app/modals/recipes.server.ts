import db from "~/db.server";

export function getAllRecipes(userId: string, q: string | null) {
  return db.recipe.findMany({
    where: { userId, name: { contains: q ?? "", mode: "insensitive" } },
    select: { id: true, name: true, totalTime: true, imageUrl: true },
    orderBy: { createdAt: "desc" },
  });
}

export function createRecipe(userId: string) {
  return db.recipe.create({
    data: {
      userId,
      name: "New Recipe",
      totalTime: "0 min",
      imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
      instructions: "",
      ingredients: {
        create: [],
      },
    },
  });
}

export function getRecipe(id: string) {
  return db.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        select: { name: true, amount: true, id: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

export function updateRecipe(id: string, data: any) {
  return db.recipe.update({ where: { id }, data: data });
}

export function updateRecipeName(id: string, name: string) {
  return db.recipe.update({ where: { id }, data: { name } });
}

export function updateRecipeTotalTime(id: string, totalTime: string) {
  return db.recipe.update({ where: { id }, data: { totalTime } });
}

export function deleteRecipe(recipeId: string) {
  return db.recipe.delete({
    where: { id: recipeId },
  });
}

export function createIngredient(recipeId: string, data: any) {
  return db.ingredient.create({
    data: {
      recipeId,
      amount: data.newIngredientAmount,
      name: data.newIngredientName,
    },
  });
}

export function deleteIngredient(ingredientId: string) {
  return db.ingredient.delete({ where: { id: ingredientId } });
}

export function updateIngredientAmount(ingredientId: string, amount: string) {
  return db.ingredient.update({
    where: { id: ingredientId },
    data: { amount },
  });
}

export function updateIngredientName(ingredientId: string, name: string) {
  return db.ingredient.update({
    where: { id: ingredientId },
    data: { name },
  });
}
