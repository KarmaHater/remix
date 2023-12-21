import z from "zod";
import {
  type LoaderFunctionArgs,
  type ActionFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useFetcher,
} from "@remix-run/react";
import {
  getAllShelves,
  createShelf,
  deleteShelf,
  saveShelf,
} from "../../modals/pantry-shelf.server";
import { SearchIcon, PlusIcon, SaveIcon } from "~/icons";
import classNames from "classnames";
import { DeleteButton, PrimaryButton } from "~/components/forms";
import { formValidation } from "~/utils/validation";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const shelves = await getAllShelves(q);
  return json({ shelves });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const saveShelfNameSchema = z.object({
    shelfName: z.string().min(1),
    shelfId: z.string(),
  });

  const deleteShelfSchema = z.object({
    shelfId: z.string(),
  });

  switch (formData.get("_action")) {
    case "deleteShelf": {
      return formValidation(
        formData,
        deleteShelfSchema,
        (data) => deleteShelf(data.shelfId),
        (errors) => json({ errors })
      );
    }
    case "createShelf":
      return createShelf();
    case "saveShelf": {
      return formValidation(
        formData,
        saveShelfNameSchema,
        (data) => saveShelf(data.shelfId, data.shelfName),
        (errors) => json({ errors })
      );
    }
  }
};

export default function Pantry() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching = navigation.formData?.has("q");
  const createShelfFetcher = useFetcher();
  const isCreatingShelf =
    createShelfFetcher.formData?.get("_action") === "createShelf";

  return (
    <div>
      <Form
        className={classNames(
          "flex border-2 border-gray-300 rounded-md",
          "focus-within:border-primary md:w-80",
          isSearching ? "animate-pulse" : ""
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
      </Form>

      <createShelfFetcher.Form method="post">
        <PrimaryButton
          className="mt-4"
          name="_action"
          value="createShelf"
          isLoading={isCreatingShelf}
        >
          <PlusIcon />
          <span className={classNames("pl-2")}>
            {isCreatingShelf ? "Creating Shelf" : "Create"}
          </span>
        </PrimaryButton>
      </createShelfFetcher.Form>

      <ul className={classNames("flex gap-8 mt-4")}>
        {data.shelves.map((shelf) => (
          <Shelf key={shelf.id} shelf={shelf} />
        ))}
      </ul>
    </div>
  );
}

type ShelfProps = {
  shelf: {
    id: string;
    name: string;
    items: Array<{ id: string; name: string }>;
  };
};

export function Shelf({ shelf }: ShelfProps) {
  const deleteShelfFetcher = useFetcher();
  const saveShelfFetcher = useFetcher();
  const isDeleteShelf =
    deleteShelfFetcher.formData?.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.formData?.get("shelfId") === shelf.id;

  console.log(deleteShelfFetcher.formData);

  return (
    <li
      key={shelf.id}
      className={classNames(
        "border-2 border-primary rounded-md p-4",
        "flex-none h-fit"
      )}
    >
      <saveShelfFetcher.Form
        reloadDocument
        method="post"
        placeholder="Shelf Name"
        autoComplete="off"
        className="flex"
      >
        <input
          type="text"
          name="shelfName"
          defaultValue={shelf.name}
          className={classNames(
            "text-2xl font-extrabold mb-2 w-full outline-none m-l-4",
            "border-b-2 border-b-background focus:border-b-primary"
          )}
        />
        <button type="submit" className="ml-2" name="_action" value="saveShelf">
          <SaveIcon />
        </button>
        <input type="hidden" name="shelfId" value={shelf.id} />
      </saveShelfFetcher.Form>

      <ul>
        {shelf.items.map((item) => (
          <li key={item.id} className="py-2">
            {item.name}
          </li>
        ))}
      </ul>
      <deleteShelfFetcher.Form className="pt-8" method="post">
        <input type="hidden" name="shelfId" value={shelf.id} />
        <DeleteButton
          className={classNames("w-full")}
          isLoading={isDeleteShelf}
          name="_action"
          value="deleteShelf"
        >
          {isDeleteShelf ? "Deleting Shelf" : "Delete"}
        </DeleteButton>
      </deleteShelfFetcher.Form>
    </li>
  );
}
