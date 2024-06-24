import db from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import { DiscoverGrid, DiscoverListItem } from "~/components/discover";

export async function loader() {
  const recipes = await db.recipe.findMany({
    take: 25,
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return { recipes };
}

export default function Discover() {
  const { recipes } = useLoaderData<typeof loader>();
  return (
    <div className="h-[calc(100vh-1rem)] p-4 m-[-1rem] overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Discover</h1>
      <DiscoverGrid>
        {recipes.map((recipe) => (
          <DiscoverListItem key={recipe.id} recipe={recipe} />
        ))}
      </DiscoverGrid>
    </div>
  );
}
