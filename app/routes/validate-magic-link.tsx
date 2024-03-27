import { json, redirect, type LoaderFunction } from "@remix-run/node";
import { type ActionFunction } from "react-router";
import z from "zod";
import { getMagicLinkPayload, invalidMagicLink } from "~/magic-links.server";
import { getSession, commitSession } from "~/session";
import { getUser } from "~/modals/user.server";
import classNames from "classnames";
import { PrimaryButton, PrimaryInput, ErrorMessage } from "~/components/forms";
import { formValidation } from "~/utils/validation";

const MAGIC_LINK_MEX_AGE = 1000 * 60 * 60 * 24 * 7; // 10 minutes

export const loader: LoaderFunction = async ({ request }) => {
  const magicLink = getMagicLinkPayload(request);
  console.log(magicLink, "magicLink");
  // Validate the expiration time of magic link
  const createdAt = new Date(magicLink.createdAt);
  const expiresAt = new Date(createdAt).getTime() + MAGIC_LINK_MEX_AGE;
  //////////////////////////////////////
  // Did not add the nonce validation
  //////////////////////////////////////
  if (Date.now() > expiresAt) {
    throw invalidMagicLink("Magic link expired");
  }
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const user = await getUser(magicLink.email);
  console.log(user, "user");
  if (user) {
    session.set("userId", user.id);
    return redirect("/app", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  return json("ok", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const signUpSchema = z.object({ firstName: z.string(), lastName: z.string() });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  return formValidation(
    formData,
    signUpSchema,
    () => redirect("/app"),
    (errors) =>
      json(
        {
          errors,
        },
        { status: 400 }
      )
  );
};

export default function ValidateMagicLink() {
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl my-8">You're almost done</h1>
        <h2>Type in you name below</h2>
        <form
          method="post"
          className={classNames(
            "flex flex-col px-8 mx-16",
            "border-2 border-gray-200 rounded-md p-8 mt-8 md-8 "
          )}
        >
          <fieldset className="mb-8 flex flex-col">
            <div className="text-left mb-4">
              <label htmlFor="firstName">First Name</label>
              <PrimaryInput
                id="firstName"
                autoComplete="off"
                name="firstName"
              />
              <ErrorMessage></ErrorMessage>
            </div>
            <div className="text-left mb-4">
              <label htmlFor="lastName">Last Name</label>
              <PrimaryInput id="lastName" autoComplete="off" name="lastName" />
              <ErrorMessage></ErrorMessage>
            </div>
          </fieldset>
          <PrimaryButton className="w-36 mx-auto" type="submit">
            Sign Up
          </PrimaryButton>
        </form>
        ;
      </div>
    </div>
  );
}
