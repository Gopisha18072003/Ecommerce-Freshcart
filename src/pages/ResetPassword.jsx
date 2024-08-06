import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import signinImage from "../assets/login_page_image.jpg";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    setIsLoading(true)
    try{const res = await fetch(
        `http://127.0.0.1:8001/api/v1/freshcart/user/resetpassword/${token}`,
        
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const response = await res.json();
      if (response.status == "success") {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 2000)
      }
      event.target.reset()

    }catch(error) {
        console.log(error)
    }

  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isPasswordMatching, setIsPasswordMatching] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const password = useRef();

  function handleConfirmPasswordChange(event) {
    const confirmPassword = event.target.value;
    if (confirmPassword == "") {
      setIsPasswordMatching(null);
    } else if (confirmPassword == password.current.value) {
      setIsPasswordMatching(true);
    } else if (
      confirmPassword !== "" &&
      confirmPassword !== password.current.value
    ) {
      setIsPasswordMatching(false);
    }
  }

  function toggleVisiblePassword() {
    setIsPasswordVisible(!isPasswordVisible);
  }
  function toggleVisibleConfirmPassword() {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  }

  return (
    <>
      <div className="flex max-h-screen m-auto justify-center">
        <main className="lg:w-2/5 mt-16 mb-16 pl-10 pr-10 h-full w-full max-w-[30rem] md:w-auto">
          <div className="mb-1 text-left">
            <h1 className="text-xl p-0 h-auto mb-4 text-left pl-2 poppins-bold">
              Freshcart
            </h1>
            <div className="signup-header mb-10 pl-2">
              <h1 className="poppins-semibold text-3xl md:text-4xl lg:text-5xl">
                Reset Password
              </h1>
              <p className="poppins-regular text-gray-400 text-sm">
                Enter your new password
              </p>
            </div>
          </div>
          <div className="h-12 my-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-myGreen-dark hover:translate-x-[-4px] transition-all cursor-pointer" onClick={() => navigate('/forgotPassword')}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="signupForm mb-6 max-h-56  text-left scrollable pr-2">
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="poppins-semibold text-gray-700 pl-2 mb-1"
                >
                  Password
                </label>
                <div className="flex border-2 items-center justify-between border-green-400 p-2 rounded-lg poppins-regular">
                  {isPasswordVisible ? (
                    <input
                      type="text"
                      name="password"
                      minLength="8"
                      className="appearance-none focus:outline-none w-4/5 text text-slate-800 "
                      ref={password}
                    />
                  ) : (
                    <input
                      type="password"
                      name="password"
                      minLength="8"
                      ref={password}
                      className="appearance-none focus:outline-none w-4/5 textPassword text-slate-800"
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
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="poppins-semibold text-gray-700 pl-2 mb-1"
                >
                  Confirm Password
                </label>
                <div
                  className={`flex border-2 items-center justify-between ${
                    isPasswordMatching === false
                      ? "border-red-500"
                      : "border-green-400"
                  } p-2 rounded-lg poppins-regular`}
                >
                  {isConfirmPasswordVisible ? (
                    <input
                      type="text"
                      name="confirmPassword"
                      minLength="8"
                      onChange={handleConfirmPasswordChange}
                      className="appearance-none focus:outline-none w-4/5 text text-slate-800"
                    />
                  ) : (
                    <input
                      type="password"
                      minLength="8"
                      name="confirmPassword"
                      onChange={handleConfirmPasswordChange}
                      className="appearance-none focus:outline-none w-4/5 textPassword text-slate-800 "
                    />
                  )}
                  <div onClick={toggleVisibleConfirmPassword}>
                    {isConfirmPasswordVisible ? (
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
                {isPasswordMatching == false && (
                  <p className="text-sm text-red-500 text-left poppins-light">
                    Confirm password is not same{" "}
                  </p>
                )}
              </div>
            </div>
            <button className="poppins-semibold px-2 py-2 rounded-md bg-myGreen-dark text-white tracking-wide mb-2 active:bg-green-600 hover:text-white text-lg disabled:bg-gray-400" disabled={isPasswordMatching == false || isPasswordMatching == null}>
              {isLoading && (
                <div className="w-[8rem]">
                    <ProgressSpinner
                  style={{ width: "30px", height: "20px" }}
                  strokeWidth="8"
                  fill="#06D001"
                  animationDuration=".5s"
                />
                </div>
                
              )} 
              {isSuccess && (
                      <div className="flex justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        <span>Reset Successfully</span>
                      </div>
                    )}
                {
                    !isLoading && !isSuccess && (
                        "Submit"
                    )
                }
            </button>
          </form>
        </main>

        <div className="w-0 md:w-1/2 lg:w-3/5 h:full">
          <img
            src={signinImage}
            alt="fresh vegetables"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </>
  );
}
