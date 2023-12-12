import type { LinksFunction, MetaFunction } from "@remix-run/node";
import PageDescription from "~/components/page-description";

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <PageDescription header="Home" description="Welcome to the home page!" />
    </div>
  );
}
