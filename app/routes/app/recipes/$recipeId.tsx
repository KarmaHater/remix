import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import classNames from "classnames";
import z from "zod";
import { formValidation } from "~/utils/validation";
import {
  getRecipe,
  updateRecipe,
  deleteRecipe,
  createIngredient,
  deleteIngredient,
} from "~/modals/recipes.server";
import {
  Input,
  ErrorMessage,
  DeleteButton,
  PrimaryButton,
} from "~/components/forms";
import { SaveIcon, TimeIcon, TrashIcon } from "~/components/icons";
import { Fragment } from "react";
import { handleDelete } from "~/modals/utils.server";
import { requireLoggedInUser } from "~/utils/auth.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireLoggedInUser(request);

  if (params.recipeId === undefined) {
    throw Error("Recipe ID is required");
  }

  const recipe = await getRecipe(params.recipeId);

  if (!recipe) {
    throw json("Not Found", { status: 404 });
  }

  if (recipe.userId !== user?.id) {
    throw json("Unauthorized", { status: 401 });
  }

  return json({ recipe }, { headers: { "Cache-Control": "max-age=10" } });
}

const saveRecipeSchema = z
  .object({
    name: z.string().min(1, "Name can not be empty"),
    totalTime: z.string().min(1, "totalTime can not be empty"),
    instructions: z.string().min(1, "Instructions can not be empty").optional(),
    ingredientIds: z
      .array(z.string().min(1, "Ingredient ID is missing"))
      .optional(),
    ingredientAmounts: z.array(z.string().nullable()).optional(),
    ingredientNames: z.array(
      z.string().min(1, "Ingredient name can not be empty").optional()
    ),
  })
  .refine(
    (data) =>
      data.ingredientIds?.length === data.ingredientAmounts?.length &&
      data.ingredientIds?.length === data.ingredientNames?.length,
    { message: "Ingredient ids must be the same length" }
  );

const createIngredientSchema = z.object({
  newIngredientAmount: z.string().min(1, "Amount can not be empty"),
  newIngredientName: z.string().min(1, "Name can not be empty"),
});

export async function action({ request, params }: LoaderFunctionArgs) {
  const user = await requireLoggedInUser(request);

  if (params.recipeId === undefined) {
    throw Error("Recipe ID is required");
  }

  const formData = await request.formData();
  const _action = formData.get("_action");

  if (typeof _action === "string" && _action.includes("deleteIngredient")) {
    const ingredientId = _action.split(".")[1];
    await handleDelete(() => deleteIngredient(ingredientId));
  }

  switch (_action) {
    case "saveRecipe":
      return formValidation(
        formData,
        saveRecipeSchema,
        async ({
          ingredientIds,
          ingredientAmounts,
          ingredientNames,
          ...data
        }) => {
          return updateRecipe(params.recipeId, {
            ...data,
            ingredients: {
              updateMany: ingredientIds?.map((id, index) => ({
                where: { id },
                data: {
                  amount: ingredientAmounts?.[index],
                  name: ingredientNames?.[index],
                },
              })),
            },
          });
        },
        (errors) => json({ errors }, { status: 400 })
      );
    case "deleteRecipe":
      await handleDelete(() => deleteRecipe(params.recipeId));
      return redirect("/app/recipes");
    case "createIngredient":
      return formValidation(
        formData,
        createIngredientSchema,
        async (data) => {
          return createIngredient(params.recipeId, {
            ...data,
          });
        },
        (errors) => json({ errors }, { status: 400 })
      );
    default: {
      return json({});
    }
  }
}

export default function RecipeDetails() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <Form method="post">
      <div className="mb-2">
        <Input
          key={data.recipe?.id}
          type="text"
          placeholder="Name"
          autoComplete="off"
          name="name"
          className="text-2xl font-extrabold"
          defaultValue={data.recipe?.name}
        />
        <ErrorMessage>{actionData?.errors?.name}</ErrorMessage>
      </div>

      <div className="flex">
        <TimeIcon />
        <div className="ml-2 flex-grow">
          <Input
            key={data.recipe?.id}
            type="text"
            placeholder="Time"
            autoComplete="off"
            name="totalTime"
            defaultValue={data.recipe?.totalTime}
          />
          <ErrorMessage>{actionData?.errors?.totalTime}</ErrorMessage>
        </div>
      </div>
      <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
        <h2 className="text-sm pb-1 font-bold">Amount</h2>
        <h2 className="text-sm pb-1 font-bold">Name</h2>
        <div></div>
        {data.recipe?.ingredients?.map((ingredient, index) => (
          <Fragment key={ingredient.id}>
            <input type="hidden" name="ingredientIds[]" value={ingredient.id} />
            <div>
              <Input
                type="text"
                autoComplete="off"
                defaultValue={ingredient.amount ?? ""}
                name="ingredientAmounts[]"
                error={!!actionData?.errors?.[`ingredientAmounts.${index}`]}
              />
              <ErrorMessage>
                {actionData?.errors?.[`ingredientAmounts.${index}`]}
              </ErrorMessage>
            </div>
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientNames[]"
                defaultValue={ingredient.name ?? ""}
                error={!!actionData?.errors?.[`ingredientAmounts.${name}`]}
              />
              <ErrorMessage>
                {actionData?.errors?.[`ingredientAmounts.${name}`]}
              </ErrorMessage>
            </div>
            <button name="_action" value={`deleteIngredient.${ingredient.id}`}>
              <TrashIcon />
            </button>
          </Fragment>
        ))}
        <div>
          <Input
            type="text"
            autoComplete="off"
            className="border-b-gray-200 border-b-visible"
            name="newIngredientAmount"
            error={!!actionData?.errors?.newIngredientAmount}
          />
          <ErrorMessage>{actionData?.errors?.newIngredientAmount}</ErrorMessage>
        </div>
        <div>
          <Input
            type="text"
            autoComplete="off"
            className="outline-b-gray-200"
            name="newIngredientName"
            error={!!actionData?.errors?.newIngredientName}
          />
          <ErrorMessage>{actionData?.errors?.newIngredientName}</ErrorMessage>
        </div>
        <button name="_action" value="createIngredient">
          <SaveIcon />
        </button>
      </div>
      <label htmlFor="instructions" className="block font-bold text-sm w-fit">
        Instructions
      </label>
      <textarea
        key={data.recipe?.id}
        id="instructions"
        name="instructions"
        placeholder="instructions go here"
        defaultValue={data.recipe?.instructions}
        className={classNames(
          "w-full h-56 rounded-md outline-none",
          "focus:border-2 focus:p-3 focus:border-primary duration-300"
        )}
      />
      <ErrorMessage>{actionData?.errors?.instructions}</ErrorMessage>

      <hr className="my-4" />
      <div className="flex justify-between">
        <DeleteButton name="_action" value="deleteRecipe">
          Delete this Recipe
        </DeleteButton>

        <PrimaryButton name="_action" value="saveRecipe">
          <div className="flex flex-col justify-center h-full">Save</div>
        </PrimaryButton>
      </div>
    </Form>
  );
}
