import { json, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json({ message: "Profile Data" });

export default function Profile() {
  return (
    <div>
      <h1>Profile Child Page</h1>
    </div>
  );
}
