import z from "zod";
import { type LoaderFunction } from "@remix-run/node";
import { type ActionFunction, json, useActionData } from "react-router";
import { v4 as uuid } from "uuid";
import { ErrorMessage } from "./app/pantry";
import { PrimaryButton, PrimaryInput } from "~/components/forms";
import { formValidation } from "~/utils/validation";
// import { sessionCookie } from "~/cookies";
import { generateMagicLink } from "~/magic-links.server";
import { requireLoggedOutUser } from "~/utils/auth.server";

const loginSchema = z.object({
  email: z.string().email(),
});

export const loader: LoaderFunction = async ({ request }) => {
  await requireLoggedOutUser(request);

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  await requireLoggedOutUser(request);

  const formData = await request.formData();

  return formValidation(
    formData,
    loginSchema,
    async ({ email }) => {
      const nonce = uuid();
      const link = generateMagicLink(email, nonce);
      console.log(link, "link");
      return json({ email, nonce });
    },
    (errors) => json({ errors, email: formData.get("email") }, { status: 400 })
  );
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="text-center mt-36">
      <h1 className="text-3xl mb-8">Remix Recipes</h1>
      <form className="mx-auto md:w-1/3" method="post">
        <div className="text-left pb-2">
          <PrimaryInput
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={actionData?.email}
          />

          <ErrorMessage>{actionData?.errors?.email}</ErrorMessage>
        </div>
        <PrimaryButton type="submit" className="w-1/3 mx-auto">
          Log In
        </PrimaryButton>
      </form>
    </div>
  );
}
