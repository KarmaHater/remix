import { requireLoggedInUser } from "~/utils/auth.server";
import { getRecipe } from "~/modals/recipes.server";
import { json } from "@remix-run/node";

export async function canChangeRecipe(request: Request, recipeId?: string) {
  const user = await requireLoggedInUser(request);

  if (recipeId === undefined) {
    throw Error("Recipe ID is required");
  }

  const recipe = await getRecipe(recipeId);

  if (!recipe) {
    throw json("RecipeNot Found ", { status: 404 });
  }

  if (recipe.userId !== user?.id) {
    throw json("Unauthorized to make changes on this recipe", { status: 401 });
  }
}
