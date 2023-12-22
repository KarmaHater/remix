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
} from "~/modals/pantry-shelf.server";
import { createShelfItem, deleteShelfItem } from "~/modals/pantry-item.server";

import { SearchIcon, PlusIcon, SaveIcon, TrashIcon } from "~/icons";
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
    shelfName: z.string().min(1, "shelf name is required"),
    shelfId: z.string(),
  });

  const deleteShelfSchema = z.object({
    shelfId: z.string(),
  });

  const createShelfItemSchema = z.object({
    shelfId: z.string(),
    itemName: z.string().min(1, "item name is required"),
  });

  const deleteShelfItemSchema = z.object({
    itemId: z.string(),
  });

  switch (formData.get("_action")) {
    case "deleteShelf": {
      return formValidation(
        formData,
        deleteShelfSchema,
        (data) => deleteShelf(data.shelfId),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "createShelf":
      return createShelf();
    case "saveShelf": {
      return formValidation(
        formData,
        saveShelfNameSchema,
        (data) => saveShelf(data.shelfId, data.shelfName),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "createShelfItem": {
      return formValidation(
        formData,
        createShelfItemSchema,
        (data) => createShelfItem(data.shelfId, data.itemName),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "deleteShelfItem": {
      return formValidation(
        formData,
        deleteShelfItemSchema,
        (data) => deleteShelfItem(data.itemId),
        (errors) => json({ errors }, { status: 400 })
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
  const createShelfItemFetcher = useFetcher();
  const isDeleteShelf =
    deleteShelfFetcher.formData?.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.formData?.get("shelfId") === shelf.id;

  return (
    <li
      key={shelf.id}
      className={classNames(
        "border-2 border-primary rounded-md p-4",
        "flex-none h-fit"
      )}
    >
      <saveShelfFetcher.Form method="post" autoComplete="off" className="flex">
        <div className="w-full mb-2">
          <input
            type="text"
            name="shelfName"
            placeholder="Shelf Name"
            defaultValue={shelf.name}
            className={classNames(
              "text-2xl  mb-2 font-extrabold w-full outline-none m-l-4",
              "border-b-2 border-b-background focus:border-b-primary",
              saveShelfFetcher.data?.errors?.shelfName ? "border-b-red-600" : ""
            )}
          />
          <div className="text-red-600 text-xs">
            {saveShelfFetcher.data?.errors?.shelfName}
          </div>
        </div>

        <button type="submit" className="ml-2" name="_action" value="saveShelf">
          <SaveIcon />
        </button>
        <input type="hidden" name="shelfId" value={shelf.id} />
      </saveShelfFetcher.Form>

      <createShelfItemFetcher.Form
        reloadDocument
        method="post"
        autoComplete="off"
        className="flex"
      >
        <div className="w-full mb-2">
          <input
            type="text"
            name="itemName"
            placeholder="Pantry Item Name"
            className={classNames(
              "mb-2  w-full outline-none m-l-4",
              "border-b-2 border-b-background focus:border-b-primary",
              createShelfItemFetcher.data?.errors?.itemName
                ? "border-b-red-600"
                : ""
            )}
          />
          <ErrorMessage>
            {createShelfItemFetcher.data?.errors?.itemName}
          </ErrorMessage>
        </div>
        <input type="hidden" name="shelfId" value={shelf.id} />
        <button type="submit" name="_action" value="createShelfItem">
          <SaveIcon />
        </button>
      </createShelfItemFetcher.Form>

      <ul>
        {shelf.items.map((item) => (
          <ShelfItem key={item.id} item={item} />
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

type ShelfItemProps = {
  item: {
    id: string;
    name: string;
  };
};

export function ShelfItem({ item }: ShelfItemProps) {
  const deleteShelfItemFetcher = useFetcher();
  return (
    <li key={item.id} className="py-2">
      <deleteShelfItemFetcher.Form
        method="post"
        className="flex"
        reloadDocument
      >
        <p className="w-full">{item.name}</p>
        <input type="hidden" name="itemId" value={item.id} />
        <ErrorMessage>
          {deleteShelfItemFetcher.data?.errors?.itemId}
        </ErrorMessage>
        <button name="_action" value="deleteShelfItem">
          <TrashIcon />
        </button>
      </deleteShelfItemFetcher.Form>
    </li>
  );
}

export function ErrorMessage({ children }: { children: string }) {
  return <div className="text-red-600 text-xs">{children}</div>;
}
