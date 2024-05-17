import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { CheckIconCircle } from "~/components/icons";
import { requireLoggedInUser } from "~/utils/auth.server";
import db from "~/db.server";

const isMatch = (ingredientName: string, pantryItemName: string) => {
  return (
    ingredientName.toLocaleLowerCase() === pantryItemName.toLocaleLowerCase()
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireLoggedInUser(request);
  if (!user) {
    return requireLoggedInUser(request);
  }

  const ingredients = await db.ingredient.findMany({
    where: {
      recipe: {
        userId: user.id,
        mealPlanMultiplier: { not: null },
      },
    },
  });

  const pantryItems = await db.pantryItem.findMany({
    where: {
      userId: user.id,
    },
  });

  const missingIngredients = ingredients.filter(
    (ingredient) =>
      !pantryItems.find((pantryItem) =>
        isMatch(ingredient.name, pantryItem.name)
      )
  );
  return { item: {} };
}

type GroceryListItem = {
  id: string;
  name: string;
  uses: Array<{
    id: string;
    amount: string | null;
    recipeName: string;
    multiplier: number;
  }>;
};

export default function GroceryListItem({ item }: { item: GroceryListItem }) {
  const fetcher = useFetcher();

  return fetcher.state !== "idle" ? null : (
    <div className="shadow-md rounded-md p-4 flex">
      <div className="flex-grow">
        <h1 className="text-sm mb-2 uppercase">{item.name}</h1>
        <ul>
          {item.uses.map((use) => (
            <li key={use.id}>
              {use.amount} for (x{use.recipeName})
            </li>
          ))}
        </ul>
      </div>
      <fetcher.Form
        method="post"
        action={`/grocery-list/${item.id}`}
        className="flex flex-col justify-center"
      >
        <button
          name="_action"
          value="checkOffItem"
          type="submit"
          className="hover:text-primary"
        >
          <CheckIconCircle />
        </button>
      </fetcher.Form>
    </div>
  );
}
