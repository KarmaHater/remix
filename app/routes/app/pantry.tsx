import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAllShelves } from "../../modals/pantry-shelf.server";
import { SearchIcon } from "~/icons";
import classNames from "classnames";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log(request, "request");
  console.log(request.url, "request");
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const shelves = await getAllShelves(q);
  return json({ shelves });
}

export default function Pantry() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams({ q: "" });

  return (
    <div>
      <form
        className={classNames(
          "flex border-2 border-gray-300 rounded-md",
          "focus-within:border-primary md:w-80"
        )}
      >
        <button type="submit" className="px-2 mr-1">
          <SearchIcon />
        </button>
        <input
          type="type"
          name="q"
          defaultValue={searchParams.get("q") ?? ""}
          autoComplete="off"
          placeholder="Search shelves"
          className="w-full py-3 px-2 outline-none"
        />
      </form>
      <ul className={classNames("flex gap-8 mt-4")}>
        {data.shelves.map((shelf) => (
          <li
            key={shelf.id}
            className={classNames(
              "border-2 border-primary rounded-md p-4",
              "flex-none h-fit"
            )}
          >
            <h1 className={"text-2xl font-extrabold mb-2"}>{shelf.name}</h1>
            <ul>
              {shelf.items.map((item) => (
                <li key={item.id} className="py-2">
                  {item.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
