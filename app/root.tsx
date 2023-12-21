import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  NavLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useResolvedPath,
  useRouteError,
  Link,
} from "@remix-run/react";
import tailwind from "./tailwind.css";
import { DiscoverIcon, HomeIcon, RecipeBookIcon, SettingsIcon } from "./icons";
import classNames from "classnames";

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : [{ rel: "stylesheet", href: tailwind }]),
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen">
        <nav className="bg-primary text-white">
          <ul className="flex flex-col">
            <AppNavLink to="/">
              <HomeIcon />
            </AppNavLink>
            <AppNavLink to="discover">
              <DiscoverIcon />
            </AppNavLink>
            <AppNavLink to="app/pantry">
              <RecipeBookIcon />
            </AppNavLink>
            <AppNavLink to="/settings">
              <SettingsIcon />
            </AppNavLink>
          </ul>
        </nav>
        <div className="p-4 w-full">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function AppNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const navigation = useNavigation();
  const path = useResolvedPath(to);
  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === path.pathname &&
    navigation.formData === null;

  return (
    <li className="w-16">
      <NavLink
        // reloadDocument
        to={to}
      >
        {({ isActive }) => (
          <div
            className={classNames(
              "p-4 flex justify-center hover:bg-primary-light",
              isActive ? "bg-primary-light" : "",
              isLoading ? "animate-pulse bg-primary-light" : ""
            )}
          >
            {children}
          </div>
        )}
      </NavLink>
    </li>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Whoops</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background">
        <div className="p-4">
          <h1 className="text-2xl pb-3">Whoops</h1>
          <p>You're seeing this page because an unexpected error occurred</p>
          {error instanceof Error ? (
            <p className="my-4 font-bold">{error.message}</p>
          ) : null}
          <Link to="/" className="text-primary">
            Take me back to the home page
          </Link>
        </div>
      </body>
    </html>
  );
}
