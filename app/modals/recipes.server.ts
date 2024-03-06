import db from "~/db.server";

export function getAllRecipes(userId: string, q: string | null) {
  return db.recipe.findMany({
    where: { userId, name: { contains: q ?? "", mode: "insensitive" } },
    select: { id: true, name: true, totalTime: true, imageUrl: true },
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
        create: [
          { amount: "1 tsp", name: "salt" },
          { amount: "2 tsp", name: "baking powder" },
          { amount: "1 tsp", name: "baking soda" },
          { amount: "2 cups", name: "flour" },
          { amount: "2 tbsp", name: "sugar" },
          { amount: "2", name: "eggs" },
          { amount: "2 cups", name: "buttermilk" },
          { amount: "2 tbsp", name: "butter, melted" },
        ],
      },
    },
  });
}

export function getRecipe(id: string) {
  return db.recipe.findUnique({ where: { id } });
}
