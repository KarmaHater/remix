import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type LoaderFunction } from "@remix-run/node";
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
  useLoaderData,
} from "@remix-run/react";
import tailwind from "./tailwind.css";
import {
  DiscoverIcon,
  HomeIcon,
  RecipeBookIcon,
  SettingsIcon,
  LoginIcon,
  LogoutIcon,
} from "./components/icons";
import classNames from "classnames";
import { getCurrentUser } from "./utils/auth.server";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "/theme.css",
  },
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : [{ rel: "stylesheet", href: tailwind }]),
];

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const user = await getCurrentUser(request);

  return json({ user, isLoggedIn: !!user });
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen">
        <nav
          className={classNames(
            "bg-primary text-white",
            "flex justify-between md:flex-col"
          )}
        >
          <ul className="flex flex-col">
            <AppNavLink to="discover">
              <DiscoverIcon />
            </AppNavLink>
            {data.isLoggedIn ? (
              <AppNavLink to="app/recipes">
                <RecipeBookIcon />
              </AppNavLink>
            ) : null}
            <AppNavLink to="/settings">
              <SettingsIcon />
            </AppNavLink>
          </ul>
          <ul>
            {data.isLoggedIn ? (
              <AppNavLink to="/logout">
                <LogoutIcon />
              </AppNavLink>
            ) : (
              <AppNavLink to="/login">
                <LoginIcon />
              </AppNavLink>
            )}
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
