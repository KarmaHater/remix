import { Form, Link, useActionData } from "@remix-run/react";
import ReactModal from "react-modal";
import { DeleteButton, ErrorMessage, IconInput, PrimaryButton } from "~/components/forms";
import { formValidation } from "~/utils/validation";
import { XIcon } from "~/components/icons";
import { useRecipeContext } from "../$recipeId";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { canChangeRecipe } from "~/utils/abilities.server";
import db from "~/db.server";
import { z } from "zod";

if (typeof window !== undefined) {
    ReactModal.setAppElement("body");
}

const updateMealPlanSchema = z.object({
    mealPlanMultiplier: z.preprocess((value) => parseInt(String(value)), z.number().min(1))
})

export async function action({ request, params }: ActionFunctionArgs) {
    const recipeId = String(params.recipeId);
    await canChangeRecipe(request, recipeId);

    const formData = await request.formData();

    switch (formData.get("_action")) {
        case "updateFromMealPlan": {
            return formValidation(
                formData,
                updateMealPlanSchema,
                async ({ mealPlanMultiplier }) => {
                    await db.recipe.update({
                        where: { id: recipeId },
                        data: { mealPlanMultiplier }
                    })
                    console.log("Updated Meal Plan");
                    return redirect(`..`);
                },
                async (error) => json({ error }, { status: 400 })
            )
        }
        case "removeFromMealPlan": {
            db.recipe.update({
                where: { id: recipeId },
                data: { mealPlanMultiplier: null }
            })
            return redirect(`..`);
        }
        default: null
    }
}

// Three options when creating Modal
// 1. Js with js and isOpen Var
// 2. Give the Modal its own route when you hit that route it is open other wise it is closed.
// 3. Can store the state is search params -- when you change search params remix 
// loads all the data on the page because it does not know which routes will be effected. (The worst option)
// 4. If you don't have a loader in your Modal route no network will be involved. 
// This is because on route transition remix only loads the data that has changed. 
// It there is no loader there is no data to remix to fetch and it will use a client side route transition.

export default function UpdateMealPlan() {
    const { recipeName, mealPlanMultiplier } = useRecipeContext();
    const actionData = useActionData();
    return (
        <ReactModal
            className="md:h-fit lg:w-1/2 md:mx-auto md:mt-24"
            isOpen={true}
        >
            <div className="p-4 rounded-md bg-white shadow-md">
                <div className="flex justify-between mb-8">
                    <h1 className="text-lg font-bold">Update Meal Plan</h1>
                    {/* Replace closing the modal does my add a entry in the browsers modal stack  */}
                    {/* If we don't use replace here clicking the back button will open and close the modal. */}
                    <Link to=".." replace>
                        <XIcon />
                    </Link>

                </div>

                <Form method="post" reloadDocument>
                    <h2 className="mb-2">{recipeName}</h2>
                    <IconInput
                        icon={<XIcon />}
                        defaultValue={mealPlanMultiplier || 1}
                        type="number"
                        autoComplete="off"
                        name="mealPlanMultiplier"
                    />
                    <ErrorMessage>{actionData?.error?.mealPlanMultiplier}</ErrorMessage>
                    <div className="flex justify-end gap-4 mt-8">
                        {mealPlanMultiplier && <DeleteButton name="_action" value="removeFromMealPlan"> Remove From Meal Plan</DeleteButton>}
                        <PrimaryButton name="_action" value="updateFromMealPlan">Save</PrimaryButton>
                    </div>
                </Form>
            </div>
        </ReactModal >
    );
}