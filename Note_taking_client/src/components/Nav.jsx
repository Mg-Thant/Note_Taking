import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

const Nav = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { updatedToken } = useContext(UserContext);

  const logoutHandler = () => {
    updatedToken(null);
  };

  return (
    <nav className="bg-slate-200 py-6 px-10 flex items-center  justify-between">
      <Link to={"/"} className="text-teal-600 font-bold text-4xl">
        SHARENOTE.IO
      </Link>
      <div className="flex items-center gap-2">
        {token ? (
          <>
            {token.user_email && (
              <p className="text-teal-600 mx-4">
                <span className="font-semibold">Login as </span>
                {token.user_email}
              </p>
            )}
            <Link to={"/create"} className="text-teal-600 font-medium">
              Create
            </Link>
            <p
              className="text-teal-600 font-medium cursor-pointer"
              onClick={logoutHandler}
            >
              Logout
            </p>
          </>
        ) : (
          <>
            <Link to={"/register"} className="text-teal-600 font-medium">
              Sign Up
            </Link>
            <Link to={"/login"} className="text-teal-600 font-medium">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
