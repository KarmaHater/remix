import { json } from "@remix-run/node";

export function loader() {
  const data = { message: "Hello, world!" };
  return json(data);
}
