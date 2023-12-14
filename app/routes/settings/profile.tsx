import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return { message: "Hello from loader profile!" };
};

export default function Profile() {
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
