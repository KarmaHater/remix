import type { LoaderFunction } from "@remix-run/node";
import { useMatchesData } from "~/utils/useMatchesData";

export const loader: LoaderFunction = () => {
  return { message: "Profile Data" };
};

export default function Profile() {
  const childReadParentData = useMatchesData("routes/settings");
  console.log({ childReadParentData });
  return (
    <div>
      <h1>Profile Child Page</h1>
    </div>
  );
}
