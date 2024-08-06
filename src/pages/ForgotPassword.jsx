import { Link, useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import signInImage from "../assets/login_page_image.jpg";
import { useState } from "react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [modal, setModal] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch(
        "http://127.0.0.1:8001/api/v1/freshcart/user/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();
      if (response.status === "fail") {
        setModal("No user found with this email.");
        setTimeout(() => setModal(""), 3000);
        setIsLoading(false);
      }else {
        setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setModal(""), 3000);
      } 
      event.target.reset()
    } catch (error) {
      setTimeout(() => dispatch(setModal("")), 3000);
    }
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
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-myGreen-dark hover:translate-x-[-4px] transition-all cursor-pointer" onClick={() => navigate('/login')}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            </div>
            <div className="mb-1 text-left">
              <div className="signup-header mb-10 pl-2 mt-[2rem]">
                <h1 className="poppins-semibold text-xl md:text-3xl lg:text-4xl tracking-wide mb-2">
                  Forgot Password
                </h1>
                <p className="poppins-regular text-gray-400 text-sm">
                  Password Reset Link will be sent to this email address
                </p>
              </div>
              <div className="h-6">
              {modal && (
                  <div className="poppins-semibold pl-2 text-red-600 ">
                    {modal}
                  </div>
                )}
              </div>
              
              <div className="signupForm mb-6">
               
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

                  <button className="poppins-semibold px-2 py-2 rounded-md bg-myGreen-dark text-white tracking-wide mb-2 active:bg-green-600 hover:text-white text-lg">
                    {isLoading && (
                      <ProgressSpinner
                        style={{ width: "30px", height: "30px" }}
                        strokeWidth="8"
                        fill="#06D001"
                        animationDuration=".5s"
                      />
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
                        <span>Email Sent</span>
                      </div>
                    )}
                    {!isSuccess && !isLoading && (
                       "Submit"
                    )}
                  </button>
                </form>
              </div>
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
