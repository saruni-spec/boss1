"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`${isOpen ? styles.closeButton : styles.toggleButton} ${
          styles.menuButton
        }`}
        onClick={toggleNavbar}
      >
        {isOpen ? "✕" : "☰"}
      </button>
      <nav className={`${styles.navbar} ${isOpen ? styles.open : ""}`}>
        <h1 className={styles.title}>Boss 1</h1>
        <ul className={styles.navList}>
          <li>
            <Link href="/" className={styles.navLink}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/add" className={styles.navLink}>
              Add Milk
            </Link>
          </li>
          <li>
            <Link href="/orders" className={styles.navLink}>
              Add New Order
            </Link>
          </li>
          <li>
            <Link href="/sales" className={styles.navLink}>
              View Paid Orders
            </Link>
          </li>
          <li>
            <Link href="/pending" className={styles.navLink}>
              View Unpaid Orders
            </Link>
          </li>
          <li>
            <Link href="/payments" className={styles.navLink}>
              View Mpesa Payments
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
