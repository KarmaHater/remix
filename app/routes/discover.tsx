import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = () => {
  return json({ message: "Hello from loader discover!" });
};

export default function Discover() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Discover</h1>
      {data.message}
    </div>
  );
}
