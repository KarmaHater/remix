import { json, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json({ message: "App Data" });
};

export default function App() {
  return (
    <div>
      <h1>App Child Page</h1>
    </div>
  );
}
