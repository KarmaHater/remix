import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  DiscoverRecipeHeader,
  DiscoverRecipeDetails,
} from "~/components/discover";
import { getRecipe } from "~/modals/recipes.server";

export function headers() {
  return {
    "Cache-Control": `max-age=3600, stale-while-revalidate=${3600 * 24 * 7}`,
  };
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params?.recipeId) {
    return redirect("/discover");
  }

  const recipe = await getRecipe(params?.recipeId);

  if (recipe === null) {
    throw json({ message: "Recipe not found" }, { status: 404 });
  }

  return { recipe };
}

export default function DiscoverRecipe() {
  const { recipe } = useLoaderData<typeof loader>();

  console.log(recipe);
  return (
    <div className="md:h-[calc(100vh-1rem)] m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={recipe} />
      <DiscoverRecipeDetails recipe={recipe} />
    </div>
  );
}
