import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = () => {
  return { message: "Hello from loader!" };
};

export default function Settings() {
  const { message } = useLoaderData();
  return (
    <div>
      <h1>Settings</h1>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      {message}
      {/* display the child route page here as well as the settings page above */}
      <Outlet />
    </div>
  );
}
