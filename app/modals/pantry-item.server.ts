import db from "../db.server";
import { handleDelete } from "./utils.server";

export function createShelfItem(shelfId: string, itemName: string) {
  return db.pantryItem.create({
    data: {
      name: itemName,
      shelfId,
    },
  });
}

export function deleteShelfItem(id: string) {
  return handleDelete(() =>
    db.pantryItem.delete({
      where: {
        id,
      },
    })
  );
}
