import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ message: ["Hello from loader discover!"] });
}

export default function Discover() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Discover</h1>
      {data.message.map((message) => message)}
    </div>
  );
}
