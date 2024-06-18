import React from "react";
import { Form } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import z from "zod";
import { CheckIconCircle } from "~/components/icons";
import { requireLoggedInUser } from "~/utils/auth.server";
import { formValidation } from "~/utils/validation";
import db from "~/db.server";

const isMatch = (ingredientName: string, pantryItemName: string) => {
  return (
    ingredientName.toLocaleLowerCase() === pantryItemName.toLocaleLowerCase()
  );
};
function getGroceryTripShelfName() {
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `Grocery Trip - ${date}`;
}

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
    include: {
      recipe: {
        select: {
          name: true,
          mealPlanMultiplier: true,
        },
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

  const groceryListItems = missingIngredients.reduce<{
    [key: string]: GroceryListItem;
  }>((acc, ingredient) => {
    const ingredientName = ingredient.name.toLocaleLowerCase();
    const existing = acc[ingredient.name] || { uses: [] };
    return {
      ...acc,
      [ingredientName]: {
        id: ingredient.id,
        name: ingredientName,
        uses: [
          ...existing.uses,
          {
            id: ingredient.recipeId,
            amount: ingredient.amount,
            recipeName: ingredient.recipe.name,
            multiplier: ingredient.recipe.mealPlanMultiplier!,
          },
        ],
      },
    };
  }, {});

  return { groceryList: Object.values(groceryListItems) };
}

const checkOffItemSchema = z.object({
  name: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireLoggedInUser(request);
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "checkOffItem":
      return formValidation(
        formData,
        checkOffItemSchema,
        async ({ name }) => {
          const ShelfName = getGroceryTripShelfName();
          let shoppingTripShelf = await db.pantryShelf.findFirst({
            where: {
              userId: user.id,
              name: ShelfName,
            },
          });

          if (shoppingTripShelf === null) {
            shoppingTripShelf = await db.pantryShelf.create({
              data: {
                name: ShelfName,
                userId: user.id,
              },
            });
          }

          return db.pantryItem.create({
            data: { userId: user.id, name, shelfId: shoppingTripShelf.id },
          });
        },
        (errors) => json({ errors }, { status: 400 })
      );
    default:
      return null;
  }
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

function GroceryListItem({ item }: { item: GroceryListItem }) {
  const fetcher = useFetcher();

  return false ? null : (
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
        action={`/app/grocery-list`}
        className="flex flex-col justify-center"
      >
        <input type="hidden" name="name" value={item.name} />
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

export default function GroceryList() {
  const { groceryList = [] } = useLoaderData<typeof loader>();

  return groceryList?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groceryList.map((item: GroceryListItem) => (
        <GroceryListItem item={item} key={item.id} />
      ))}
    </div>
  ) : (
    <div className="w-fit m-auto text-center py-16">
      <h1 className="text-3xl">All set!</h1>
      <div className="text-primary flex justify-center py-4">
        <CheckIconCircle large />
      </div>
      <p className="text-sm">
        You have everything you need for your meal plan.
      </p>
    </div>
  );
}
