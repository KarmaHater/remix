import classNames from "classnames";
import z from "zod";
import { type LoaderFunction } from "@remix-run/node";
import { type ActionFunction, json, useActionData } from "react-router";
import { v4 as uuid } from "uuid";
import { ErrorMessage } from "./app/pantry";
import { PrimaryButton } from "~/components/forms";
import { formValidation } from "~/utils/validation";
import { getUser } from "~/modals/user.server";
// import { sessionCookie } from "~/cookies";
import { commitSession, getSession } from "~/session";
import { generateMagicLink } from "~/magic-links.server";

const loginSchema = z.object({
  email: z.string().email(),
});

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  commitSession(session);

  console.log(session.data, "session");
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const formData = await request.formData();

  return formValidation(
    formData,
    loginSchema,
    async ({ email }) => {
      // example with sessions in remix
      // const user = await getUser(email);
      // if (user === null) {
      //   return json(
      //     { email: `${email} User not found; HttpOnly; Secure` },
      //     { status: 400 }
      //   );
      // }
      // session.set("userId", user.id);
      // return json(
      //   { email },
      //   {
      //     headers: {
      //       "Set-Cookie": await commitSession(session),
      //     },
      //   }
      // );
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
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={actionData?.email}
            className={classNames(
              "w-full outline-none border-2 border-gray-200",
              "focus:border-primary rounded-md p-2"
            )}
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
