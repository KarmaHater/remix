import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useFetchers,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { PrimaryButton, SearchBar } from "~/components/forms";
import {
  RecipeCard,
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes";
import { CalendarIcon, PlusIcon } from "~/components/icons";
import { getAllRecipes, createRecipe } from "~/modals/recipes.server";
import { requireLoggedInUser } from "~/utils/auth.server";
import classNames from "classnames";
import { useBuildSearchParams } from "~/utils/misc";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireLoggedInUser(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const filter = url.searchParams.get("filter") || "";
  const recipes = await getAllRecipes(user.id, q, filter);

  return json({ recipes });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireLoggedInUser(request);
  const recipe = await createRecipe(user.id);
  const url = new URL(request.url);

  url.pathname = `/app/recipes/${recipe.id}`;

  return redirect(url.toString());
}

export default function Recipes() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();
  const fetchers = useFetchers()
  const [searchParams] = useSearchParams();
  const mealPlanOnlyOn = searchParams.get("filter") === "mealPlanOnly";
  const buildSearchParams = useBuildSearchParams();

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <div className="flex gap-4 ">
          <SearchBar placeholder="Search recipes..." className="flex-grow" />
          <Link reloadDocument to={
            buildSearchParams('filter', mealPlanOnlyOn ? "" : "mealPlanOnly")
          }
            className={classNames(
              'flex flex-col justify-center border-2 border-primary rounded-md px-2',
              mealPlanOnlyOn ? "text-white bg-primary" : "px-2 text-primary"
            )}
          >
            <CalendarIcon />
          </Link>
        </div>
        <Form method="post" className="mt-4" reloadDocument>
          <PrimaryButton type="submit" className="w-full">
            <div className="flex w-full justify-center">
              <PlusIcon />
              <span className="ml-2">Create New Recipe</span>
            </div>
          </PrimaryButton>
        </Form>
        <ul>
          {data.recipes.map((recipe) => {
            const isLoading = navigation.location?.pathname.endsWith(recipe.id);
            const optimisticData = new Map();

            for (const fetcher of fetchers) {
              if (fetcher.formAction?.includes(recipe.id)) {
                if (fetcher.formData?.get("_action") === "saveName") {
                  optimisticData.set("name", fetcher.formData.get("name"))
                }
                if (fetcher.formData?.get("_action") === "saveTotalTime") {
                  optimisticData.set("totalTime", fetcher.formData.get("totalTime"))
                }
              }
            }

            return (
              <li className="my-4" key={recipe.id}>
                <NavLink
                  to={{ pathname: recipe.id, search: location.search }}
                  prefetch="intent"
                >
                  {({ isActive }) => (
                    <RecipeCard
                      name={optimisticData.get("name") || recipe.name}
                      totalTime={optimisticData.get("totalTime") || recipe.totalTime}
                      imageUrl={recipe.imageUrl}
                      isActive={isActive}
                      isLoading={isLoading}
                      mealPlanMultiplier={recipe.mealPlanMultiplier}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
