import {
  LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { PrimaryButton } from "~/components/forms";
import { themeCookie } from "~/cookies";
import { formValidation } from "~/utils/validation";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = await request.headers.get("cookie");
  const theme = await themeCookie.parse(cookieHeader);

  return json({ theme: typeof theme === "string" ? theme : "green" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  return formValidation(
    formData,
    themeSchema,
    async ({ theme }) => {
      return json(
        { theme },
        {
          headers: {
            "Set-Cookie": await themeCookie.serialize(theme),
          },
        }
      );
    },
    async (errors) => json({ errors }, { status: 400 })
  );
}

const themeSchema = z.object({ theme: z.string() });

export default function App() {
  const { theme } = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <Form reloadDocument method="post">
      <div className="mb-4 flex flex-col">
        <label htmlFor="theme" className="form-label">
          Theme
        </label>
        <select
          name="theme"
          className="p-2 mt-2 border-2 border-gray-200 rounded-md w-full md:w-64"
          defaultValue={actionData?.theme ?? theme}
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
        </select>
      </div>
      <PrimaryButton>Save</PrimaryButton>
    </Form>
  );
}
