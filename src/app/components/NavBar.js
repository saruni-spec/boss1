import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav>
      <h1>Boss 1</h1>
      <ul>
        <li>
          <Link href={"/"}>Dashboard</Link>
        </li>
        <li>
          <Link href={"/add"}>Add</Link>
        </li>
        <li>
          <Link href={"/orders"}>Orders</Link>
        </li>
        <li>
          <Link href={"/sales"}>Sales</Link>
        </li>
        <li>
          <Link href={"/pending"}>Pending</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
