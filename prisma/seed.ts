import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function getShelves() {
  return [
    {
      name: "Dairy Products",
      items: {
        create: [{ name: "Milk" }, { name: "Eggs" }, { name: "Cheese" }],
      },
    },
    {
      name: "Fruit Products",
      items: {
        create: [{ name: "Apples" }, { name: "Plums" }, { name: "Oranges" }],
      },
    },
  ];
}

async function seed() {
  await Promise.all(
    getShelves().map((shelf) => db.pantryShelf.create({ data: shelf }))
  );
}

seed();
