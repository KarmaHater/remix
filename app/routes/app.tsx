import { type ReactNode } from "react";
import { NavLink as RemixNavLink, Outlet } from "@remix-run/react";
import classNames from "classnames";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">Recipe Book</h1>
      <nav className="border-b-2 pb-2 mt-2">
        <NavLink to="recipes">Recipes</NavLink>
        <NavLink to="pantry">Pantry</NavLink>
      </nav>
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <RemixNavLink
      className={({ isActive }) =>
        classNames(
          "hover:text-gray-500 pb-2.5 px-2 md:px-4",
          isActive ? "border-b-2 border-b-primary" : ""
        )
      }
      to={to}
    >
      {children}
    </RemixNavLink>
  );
}
