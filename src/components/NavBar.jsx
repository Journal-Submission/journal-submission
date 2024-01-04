import React from "react";
import { Link, useLocation } from "react-router-dom";
import menuList from "../config/menuConfig";

function NavBar() {
  /* it save the current selected or active nav-item until we changes the pathname & also get actual instance after reloads the page.
   */
  const { pathname } = useLocation();
  
  return (
    <>
      <div className="text-bg-dark">
        <header className=" container d-flex justify-content-center py-3">
          <nav>
            <ul className="nav nav-pills justify-content-center align-items-center">
              { menuList.map(({ navList, href, id }) => {
                return (
                  <li className="nav-item mb-0" key={id}>
                    <Link
                      to={href}
                      className={`nav-link ${
                        href === pathname ? "active text-white" : ""
                      }`}
                      aria-current="page"
                    >
                      {navList}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
      </div>
    </>
  );
}

export default NavBar;