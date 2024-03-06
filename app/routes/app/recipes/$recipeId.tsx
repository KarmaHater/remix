import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRecipe } from "~/modals/recipes.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.recipeId === undefined) {
    throw Error("Recipe ID is required");
  }

  const recipe = await getRecipe(params.recipeId);
  return json({ recipe });
}

export default function RecipeDetails() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{data.recipe?.name}</h1>
    </div>
  );
}
