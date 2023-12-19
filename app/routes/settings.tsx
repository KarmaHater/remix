import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { useMatchesData } from "~/utils/useMatchesData";

export const loader: LoaderFunction = () => {
  return { message: "Setting Data" };
};

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  const appData = useMatchesData("routes/settings/app");
  const profileData = useMatchesData("routes/settings/profile");

  console.log(appData);
  console.log(profileData);
  console.log(data);

  return (
    <div>
      <h1 style={{ border: "1px solid green", padding: "5px", margin: "15px" }}>
        Settings Page / Parent
      </h1>
      <nav>
        <Link
          style={{ border: "1px solid blue", padding: "5px", margin: "15px" }}
          to="app"
        >
          App Link
        </Link>
        <Link
          style={{ border: "1px solid blue", padding: "5px", margin: "15px" }}
          to="profile"
        >
          Profile Link
        </Link>
      </nav>
      {/* {data.message} */}
      <div
        style={{ border: "4px solid pink", padding: "20px", margin: "10px" }}
      >
        <Outlet />
      </div>
      {/* display the child route page here as well as the settings page above */}
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
