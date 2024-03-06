import { type LoaderFunction, json } from "@remix-run/node";
import { destroySession, getSession } from "~/session";

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const headerCookie = request.headers.get("cookie");
  const session = await getSession(headerCookie);

  return json("ok", {
    headers: { "Set-Cookie": await destroySession(session) },
    status: 200,
  });
};

export default function Logout() {
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl">You are good to go</h1>
        <p className="py-8">Logout successful</p>
        <a className="text-primary" href="/">
          Take me home
        </a>
      </div>
    </div>
  );
}
