import { Link, useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCart, updateCart } from "../util/http";
import { setCartData } from "../store/cart-slice";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import signInImage from "../assets/login_page_image.jpg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearModal,
} from "../store/auth-slice";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, modal } = useSelector((state) => state.auth);
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    try {
      dispatch(signInStart());
      const res = await fetch(
        "http://127.0.0.1:8001/api/v1/freshcart/user/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();
      if (!response.status === "success") {
        dispatch(signInFailure(data));
        setTimeout(() => dispatch(clearModal()), 3000);
        return;
      }
      dispatch(signInSuccess(response.data.user));
      // after signin getting data from database
      const addCartData = async () => {
        const response = await getCart();
        if(response.items.length > 0) {
          const cartItems = response.items
          const total = response.total
  
          dispatch(setCartData({items: cartItems, total}))
        }
        
      }
      addCartData()
      
      setTimeout(() => dispatch(clearModal()), 3000);
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
      setTimeout(() => dispatch(clearModal()), 3000)
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(null);

  function toggleVisiblePassword() {
    setIsPasswordVisible(!isPasswordVisible);
  }
  function handleEmailChange(event) {
    const email = event.target.value;
    if (email == "") {
      setIsEmailValid(null);
    } else if (email.includes("@") && email.endsWith(".com")) {
      setIsEmailValid(true);
    } else if (
      (email != "" && !email.includes("@")) ||
      !email.endsWith(".com")
    ) {
      setIsEmailValid(false);
    }
  }

  return (
    <>
      <div className="flex max-h-screen m-auto justify-center">
        <div className="lg:w-2/5 md:w-1/2 mt-16 mb-16 pl-10 pr-10 flex items-center">
          <main className="">
            <h1 className="poppins-bold text-2xl p-0 h-auto mb-4 text-left pl-2 lg:text-xl">
              Freshcart
            </h1>
            <div className="mb-1 text-left">
              <div className="signup-header mb-10 pl-2">
                <h1 className="poppins-semibold text-3xl md:text-4xl lg:text-5xl tracking-wide">
                  Welcome Back
                </h1>
                <p className="poppins-regular text-gray-400 text-sm">
                  Sign in with your email address and password
                </p>
              </div>

              <div className="signupForm mb-6">
                {modal &&  modal.split(' ')[0] == 'Invalid' && (
                  <div
                    className='poppins-semibold pl-2 text-red-600 '
                  >
                    {modal}
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col justify-start"
                >
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="poppins-semibold text-gray-700 pl-2"
                    >
                      Email Address
                    </label>
                    <div
                      className={`flex flex-row border-2 items-center justify-between ${
                        isEmailValid == false
                          ? "border-red-600"
                          : "border-green-400"
                      } p-2 rounded-lg`}
                    >
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="johndoe123@gmail.com"
                        onChange={handleEmailChange}
                        className={`appearance-none focus:outline-none w-4/5 text text-slate-800 poppins-regular `}
                      />
                      {isEmailValid && (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-green-400"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="text text-gray-700 pl-2 mb-1 poppins-semibold"
                    >
                      Password
                    </label>
                    <div className="flex border-2 items-center justify-between border-green-400 p-2 rounded-lg">
                      {isPasswordVisible ? (
                        <input
                          type="text"
                          name="password"
                          minLength="8"
                          className="appearance-none focus:outline-none w-4/5 text text-slate-800 poppins-regular"
                        />
                      ) : (
                        <input
                          type="password"
                          name="password"
                          minLength="8"
                          className="appearance-none focus:outline-none w-4/5 textPassword text-slate-800 bold poppins-regular"
                        />
                      )}
                      <div onClick={toggleVisiblePassword}>
                        {isPasswordVisible ? (
                          <FontAwesomeIcon
                            icon={faEye}
                            className="cursor-pointer"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            className="cursor-pointer "
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 hover:text-gray-700 text-right pr- cursor-pointer poppins-regular" onClick={() => navigate('/forgotPassword')}>
                      Forgot password?
                    </p>
                  </div>
                  <button className="poppins-semibold px-2 py-2 rounded-md bg-myGreen-dark text-white tracking-wide mb-2 active:bg-green-600 hover:text-white text-lg">
                    {loading ? (
                      <ProgressSpinner
                        style={{ width: "30px", height: "30px" }}
                        strokeWidth="8"
                        fill="#06D001"
                        animationDuration=".5s"
                      />
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              </div>

              <p className="poppins-regular">
                Don't have account?{" "}
                <Link
                  className="signup-btn poppins-semibold hover:text-green-400 cursor-pointer"
                  to="/signup"
                >
                  SignUp
                </Link>
              </p>
            </div>
          </main>
        </div>

        <div className="w-0 md:w-1/2 lg:w-3/5 h:full">
          <img
            src={signInImage}
            alt="fresh vegetables"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </>
  );
}
