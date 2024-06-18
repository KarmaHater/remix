import { type ReactNode } from "react";
import { NavLink as RemixNavLink } from "@remix-run/react";
import classNames from "classnames";
import { PageLayout } from "~/components/layout";

export default function App() {
  return (
    <PageLayout
      title="Recipe Book"
      links={[
        { to: "recipes", label: "Recipes" },
        { to: "pantry", label: "Pantry" },
        { to: "grocery-list", label: "Grocery List" },
      ]}
    />
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
