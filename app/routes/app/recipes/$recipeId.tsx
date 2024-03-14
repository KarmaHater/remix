import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getRecipe } from "~/modals/recipes.server";
import { Input, ErrorMessage } from "~/components/forms";
import { TimeIcon, TrashIcon } from "~/components/icons";
import { Fragment } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params.recipeId === undefined) {
    throw Error("Recipe ID is required");
  }

  const recipe = await getRecipe(params.recipeId);
  return json({ recipe }, { headers: { "Cache-Control": "max-age=10" } });
}

export async function action({ request, params }: LoaderFunctionArgs) {}

export default function RecipeDetails() {
  const data = useLoaderData<typeof loader>();
  console.log(data, "data");
  return (
    <Form method="post" reloadDocument>
      <div className="mb-2">
        <Input
          key={data.recipe?.id}
          type="text"
          placeholder="Recipe name"
          className="text-2xl font-extrabold"
          autoComplete="off"
          name="name"
          defaultValue={data.recipe.name}
        />
        <ErrorMessage name="name"></ErrorMessage>
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
          <ErrorMessage name="totalTime"></ErrorMessage>
        </div>
      </div>
      <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
        <h2 className="text-sm pb-1 font-bold">Amount</h2>
        <h2 className="text-sm pb-1 font-bold">Name</h2>
        <div></div>
        {data.recipe?.ingredients?.map((ingredient) => (
          <Fragment key={ingredient.id}>
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="amount"
                defaultValue={ingredient.amount ?? ""}
              />
              <ErrorMessage name="amount"></ErrorMessage>
            </div>
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="name"
                defaultValue={ingredient.name}
              />
              <ErrorMessage name="name"></ErrorMessage>
            </div>
            <button type="button">
              <TrashIcon />
            </button>
          </Fragment>
        ))}
      </div>
    </Form>
  );
}
