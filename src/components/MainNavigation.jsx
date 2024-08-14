import { Dropdown } from "primereact/dropdown";
import { useCallback, useEffect, useState } from "react";
import AutoCompleteInput from "../ui/AutoCompleteInput";
import { categories } from "../App";
import { Link, NavLink, redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "../util/authServices";
//import { logout, updateToken } from "../store/auth-slice";
import { signOut } from "../store/auth-slice";

export default function MainNavigation({ products, classes }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cartData = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleClickNavigate(page) {
    if (page == "me") navigate("/me");
    else if ("cart") navigate("/cart");
  }

  // vaidating access token
  useEffect(() => {
    const validateToken = async () => {
      if (user) {
        const response = await refreshAccessToken();
        console.log("Refresh Token", response);
        if (response.status == 'fail' ) {
          
          dispatch(signOut);
        }
      }
    };
    validateToken();
  }, [user, dispatch]);

  const [validSearch, setValidSearch] = useState(false);

  useEffect(() => {
    if (typeof selectedProduct === "object" && selectedProduct !== null) {
      setValidSearch(true);
    }
  }, [selectedProduct]);

  function handleSearchProduct() {
    const productId = selectedProduct["_id"];
    navigate(`/product/${productId}`);
  }

  return (
    <div
      className={`bg-white pt-4 px-8 ${classes} w-full z-10 pb-8 border-b-4 border-gray-200`}
    >
      <div className="flex justify-between items-center">
        <h1 className="poppins-bold text-2xl">Freshcart</h1>
        <div id="search-bar" className="flex items-center ">
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories}
            optionLabel="name"
            placeholder="Select a Category"
            className="w-full md:w-14rem poppins-medium border-slate-600 border-2 px-4 py-2.5 rounded-s-md mySvg"
          />
          <div className="flex">
            <AutoCompleteInput
              products={products}
              category={selectedCategory}
              className="my-custom-autocomplete poppins-medium border-2 border-black"
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
            <button
              className="bg-orange-400 px-2.5 py-2.5 flex poppins-medium text-white gap-2 rounded-e-md disabled:bg-gray-400"
              disabled={!validSearch}
              onClick={handleSearchProduct}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search
            </button>
          </div>
        </div>
        <div id="contact" className="flex gap-2 items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <span className="poppins-light text-sm">Get in Touch</span>
            <p className="poppins-medium text-md">+91 7235679901</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className=" bg-myGreen-dark rounded-md flex items-center py-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>

          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories}
            optionLabel="name"
            placeholder="Browse Category"
            className="w-full md:w-14rem poppins-medium pr-4 pl-2 py-2.5  mySvg text-white"
          />
        </div>
        <nav>
          <ul className="poppins-light flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) => (isActive ? "font-bold" : undefined)}
            >
              Support
            </NavLink>
            {user?.role == "admin" && (
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? "font-bold text-myGreen-dark" : "text-myGreen-dark"
                }
              >
                Products
              </NavLink>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-4 relative">
          {user && (
            <div>
              {cartData.items.length > 0 && (
                <div className="w-5 h-5 rounded-full text-white bg-orange-600 text-center flex justify-center items-center absolute top-0 left-[-4px]">
                  <span className="block">{cartData.items.length}</span>
                </div>
              )}
              <div className="flex gap-8">
                <div
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => handleClickNavigate("cart")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#06D001"
                    className="size-11 border-2 border-myGreen-dark rounded-md p-1.5 bg-lime-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>

                <div
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => handleClickNavigate("me")}
                >
                  <img
                    src={`https://freshcart-api-4ftp.onrender.com/${user.image}`}
                    alt="Profile Image"
                    className="w-full h-full rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>
          )}
          {!user && (
            <Link
              className="poppins-medium bg-black text-white px-4 py-4 rounded-md"
              to="/login"
            >
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
