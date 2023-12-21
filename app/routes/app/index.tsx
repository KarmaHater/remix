import { redirect, type LoaderFunction } from "@remix-run/node";

// resource route
export const loader: LoaderFunction = () => {
  //native way to redirect  to /app/pantry
  //   return new Response(null, {
  //     status: 302,
  //     headers: { Location: "/app/pantry" },
  //   });

  return redirect("/app/pantry", { status: 302 });
};
