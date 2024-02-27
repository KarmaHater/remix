import db from "../db.server";
import { handleDelete } from "./utils.server";

export function createShelfItem(
  userId: string,
  shelfId: string,
  itemName: string
) {
  return db.pantryItem.create({
    data: {
      userId,
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

export const getShelfItems = (shelfId: string) =>{
  return db.pantryItem.findMany({
    where: {
      shelfId,
    },
  });
}
