import { Link, Outlet } from "@remix-run/react";

export default function About() {
  return (
    <div>
      <Outlet />
      <h1>About</h1>
      <nav>
        <Link to="">About</Link>
        <Link to="team">Team</Link>
        <Link to="history">History</Link>
      </nav>
    </div>
  );
}
