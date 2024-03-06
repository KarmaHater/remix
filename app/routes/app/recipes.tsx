import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { PrimaryButton, SearchBar } from "~/components/forms";
import {
  RecipeCard,
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes";
import { PlusIcon } from "~/icons";
import { getAllRecipes, createRecipe } from "~/modals/recipes.server";
import { requireLoggedInUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireLoggedInUser(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const recipes = await getAllRecipes(user.id, q);

  return json({ recipes });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireLoggedInUser(request);
  const recipe = await createRecipe(user.id);

  return redirect(`/app/recipes/${recipe.id}`);
}

export default function Recipes() {
  const data = useLoaderData<typeof loader>();

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <SearchBar placeholder="Search recipes" />
        <Form method="post" className="mt-4" reloadDocument>
          <PrimaryButton type="submit" className="w-full">
            <div className="flex w-full justify-center">
              <PlusIcon />
              <span className="ml-2">Create New Recipe</span>
            </div>
          </PrimaryButton>
        </Form>
        <ul>
          {data.recipes.map((recipe) => (
            <li className="my-4" key={recipe.id}>
              <NavLink reloadDocument to={`/app/recipes/${recipe.id}`}>
                {({ isActive }) => (
                  <RecipeCard
                    name={recipe.name}
                    totalTime={recipe.totalTime}
                    imageUrl={recipe.imageUrl}
                    isActive={isActive}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
