import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { useMatchesData } from "~/utils/useMatchesData";

export const loader: LoaderFunction = () => {
  return { settingMessage: "Hello from loader!" };
};

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  const { message } = useMatchesData("routes/settings/profile");
  return (
    <div>
      <h1>Settings</h1>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      {message}
      {data.settingMessage}
      {/* display the child route page here as well as the settings page above */}
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (error instanceof Error) {
    return (
      <div>
        <p>There was an error Settings page!</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return <p>There was an error Settings page!</p>;
}
