import { handleDelete } from "./utils.server";
import db from "../db.server";

export function getAllShelves(query: string | null) {
  return db.pantryShelf.findMany({
    where: {
      name: {
        contains: query ?? "",
        mode: "insensitive",
      },
    },
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function createShelf() {
  return db.pantryShelf.create({
    data: {
      name: "New Shelf",
    },
  });
}

export function deleteShelf(shelfId: string) {
  return handleDelete(() =>
    db.pantryShelf.delete({
      where: {
        id: shelfId,
      },
    })
  );
}

export function saveShelf(shelfId: string, shelfName: string) {
  return db.pantryShelf.update({
    where: {
      id: shelfId,
    },
    data: {
      name: shelfName,
    },
  });
}
