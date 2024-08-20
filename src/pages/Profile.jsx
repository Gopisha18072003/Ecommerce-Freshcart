import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  clearModal,
  signOut,
  updateCurrentUser,
  setModalStore,
} from "../store/auth-slice";
import {
  deleteAccount,
  fetchMyOrders,
  logoutUser,
  resetPassword,
  updateUserData,
} from "../util/http";
import ImageUpload from "../components/ImageUpload";
import { uploadImage } from "../util/http";
import Input from "../components/Input";
import { ProgressSpinner } from "primereact/progressspinner";
import ConfirmModal from "../components/ConfirmModal";
import Order from "../components/Order";
import { Link } from "react-router-dom";

export default function Profile() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  let name,
    email,
    address,
    image,
    pincode = null;
  if (currentUser) {
    name = currentUser.name;
    email = currentUser.email;
    address = currentUser.address;
    image = currentUser.image;
    pincode = currentUser.pincode;
  }
  const [selectedAction, setSelectedAction] = useState("profile");
  const isProfileUploading = useSelector(
    (state) => state.ui.isProfileUploading
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(signOut());
      setTimeout(() => dispatch(clearModal()), 3000);
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });

  function onClickConfirm(text) {
    if (selectedAction == "logout") {
      setConfirmModal(text);

      if (text == "cancel") {
        setConfirmModal(null);
        setSelectedAction("profile");
      } else if (text == "okay") {
        setConfirmModal(null);
        mutate();
      }
      return;
    }
  }

  function handleChaneAction(action) {
    if (action == "logout") {
      setConfirmModal("pending");
    }
    if (action == "orders" && currentUser.role == "admin") {
      navigate("/orders");
    }

    setSelectedAction(action);
  }
  const [isEmailValid, setIsEmailValid] = useState(true);

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

  const {
    mutate: mutateUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: updateUserData,
    onSuccess: (data) => {
      dispatch(updateCurrentUser(data.user));
      setModal({ type: "success", message: "Updated Successfully" });
      setTimeout(() => setModal(null), 3000);
    },
    onError: () => {
      setModal({ type: "fail", message: "Updation Failed" });
      setTimeout(() => setModal(null), 3000);
    },
  });

  function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data["name"] = `${data["firstName"]} ${data["lastName"]}`;
    mutateUser(JSON.stringify(data));
  }

  const {
    mutate: mutatePassword,
    isPending: isPendingReset,
    isErrorReset,
    errorReset,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      dispatch(updateCurrentUser(data.user));
      setModal({ type: "success", message: "Updated Successfully" });
      setTimeout(() => setModal(null), 3000);
    },
    onError: () => {
      setModal({ type: "fail", message: "Incorrect Password! Try again" });
      setTimeout(() => setModal(null), 3000);
    },
  });

  function handleResetPassword(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    mutatePassword(JSON.stringify(data));
    event.target.reset();
  }

  const [isPasswordMatching, setIsPasswordMatching] = useState(null);
  const password = useRef();
  function handlePasswordChange(e) {
    const confirmPassword = e.target.value;
    if (password.current.value !== confirmPassword) {
      setIsPasswordMatching(false);
    } else {
      setIsPasswordMatching(true);
    }
  }

  const {
    data: myOrders,
    isPending: isPendingOrders,
    isErrorOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrders,
  });

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteAccount();

      console.log(response);

      if (response.status === "success") {
        dispatch(setModalStore("Deleted Successfully"));
        setTimeout(() => {
          dispatch(clearModal());
        }, 3000);

        dispatch(signOut());
        navigate("/");
      } else {
        console.error("Deletion was not successful:", response);
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  const { modal: storeModal } = useSelector((state) => state.auth);
  return (
    <div className="w-full h-[44rem] bg-gray-100 flex items-center justify-center">
      {modal && (
        <span
          className={`z-50 fixed top-[12rem] left-[38rem] poppins-semibold ${
            modal.type == "success" ? "bg-myGreen-light" : "bg-orange-400"
          } text-white p-4 rounded-md`}
        >
          {modal.message}
        </span>
      )}
      {storeModal && (
        <div
          className={`fixed z-50 top-[9rem] left-[42%] bg-orange-400  p-4 poppins-semibold text-white rounded-md`}
        >
          {storeModal}
        </div>
      )}

      <div className="w-[80%] h-[26rem] bg-white mt-[6rem] mb-2 rounded-3xl flex">
        <aside
          className="border-r-4 border-gray-300 w-[30%]"
          id="navBarProfile"
        >
          <ul className="flex flex-col justify-center h-full  gap-0 poppins-regular tracking-wide">
            <li
              onClick={() => handleChaneAction("profile")}
              className={`flex gap-2 ${
                selectedAction == "profile" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <span>Edit Profile</span>
            </li>
            <li
              onClick={() => handleChaneAction("orders")}
              className={`flex gap-2 ${
                selectedAction == "orders" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
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
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>

              <span>All Orders</span>
            </li>
            <li
              onClick={() => handleChaneAction("notification")}
              className={`flex gap-2 ${
                selectedAction == "notification" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>

              <span>Notifications</span>
            </li>
            <li
              onClick={() => handleChaneAction("security")}
              className={`flex gap-2 ${
                selectedAction == "security" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
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
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>

              <span>Security</span>
            </li>
            <li
              onClick={() => handleChaneAction("logout")}
              className={`flex gap-2 ${
                selectedAction == "logout" ? "active" : ""
              } py-4 pl-8 cursor-pointer`}
            >
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
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>

              <span>Logout</span>
            </li>
          </ul>
        </aside>
        <main className="w-[70%] px-12 py-12 overflow-y-scroll">
          {confirmationModal && selectedAction == "security" && (
            <div className="fixed top-[50%] bg-white p-[2rem] left-[48%] rounded-xl border-2 border-gray-300 flex flex-col justify-center items-center">
              <h1 className="poppins-semibold text-lg">Are you sure ?</h1>
              <p className="poppins-regular text-sm text-gray-400">
                you cannnot retreive your account back.
              </p>
              <div className="flex gap-12 mt-4">
                <button
                  className="p-2 rounded-md bg-red-500 text-white poppins-semibold"
                  onClick={handleDeleteAccount}
                >
                  {isDeleting && (
                    <div>
                      <ProgressSpinner />
                    </div>
                  )}
                  {!isDeleting && "Delete"}
                </button>
                <button
                  className="poppins-semibold hover:text-myGreen-dark"
                  onClick={() => setConfirmationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div
            className={`w-[50%] h-[50%] ${
              confirmModal == null ||
              (confirmModal == "pending" && selectedAction !== "logout")
                ? "hidden"
                : "relative"
            }`}
          >
            {confirmModal !== null && selectedAction == "logout" && (
              <ConfirmModal
                text="Logout"
                setConfirmModal={setConfirmModal}
                onClickButton={onClickConfirm}
              />
            )}
          </div>
          {selectedAction == "profile" && (
            <div>
              <div className="w-[8rem] mx-auto">
                {isProfileUploading && <ProgressSpinner className="w-[8rem] h-[8rem] size-4"/>}
                {!isProfileUploading && (
                  <img
                    src={image}
                    alt="profile photo"
                    crossOrigin="anonymous"
                    className="w-[8rem] h-[8rem] rounded-full relative object-cover"
                  />
                )}

                <ImageUpload id="image" onInput={uploadImage} />
              </div>

              <div>
                <form
                  action=""
                  className="flex flex-col items-start gap-4"
                  onSubmit={handleFormSubmit}
                >
                  <div className="flex gap-10 justify-center">
                    <Input
                      label="First Name"
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={name.split(" ")[0]}
                      required={true}
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={name.split(" ")[1]}
                      required={true}
                    />
                  </div>
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={email}
                    className={`w-[15rem] ${
                      isEmailValid == true
                        ? "border-myGreen-dark"
                        : "border-red-600"
                    } outline-none`}
                    id="email"
                    onChange={handleEmailChange}
                    required={true}
                  />
                  <Input
                    label="Address"
                    type="text"
                    id="address"
                    name="address"
                    className="w-[20rem]"
                    value={address}
                    placeholder="East college para, Raniganj"
                  />
                  <Input
                    label="Pincode"
                    type="Number"
                    id="pincode"
                    name="pincode"
                    length="7"
                    className="w-24"
                    value={pincode}
                    placeholder="713347"
                  />
                  <button
                    className="outline-none p-2 bg-orange-500 rounded-md poppins-semibold text-white mx-auto disabled:bg-gray-500 w-[6rem] h-[3rem]"
                    disabled={!isEmailValid}
                  >
                    {isPending ? (
                      <ProgressSpinner className="size-8" strokeWidth="8" />
                    ) : (
                      "Update"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {selectedAction == "orders" && currentUser?.role == "user" && (
            <div
              className="flex justify-center items-center w-full "
              id="container"
            >
              {isPendingOrders && (
                <ProgressSpinner className="custom-spinner" />
              )}
              {!isPendingOrders && myOrders && (
                <div className="w-full h-full  ">
                  {myOrders?.orders?.length > 0 && (
                    <ul className=" flex flex-col gap-12 py-2 border-l-4 border-orange-200 bg-orange-50 text-gray-700 ">
                      {myOrders.orders.map((order) => {
                        return (
                          <li key={order._id}>
                            <Order order={order} />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {myOrders?.orders?.length == 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src="/noOrders.png"
                        alt="no orders image"
                        className="w-[16rem]"
                      />
                      <h1 className="poppins-semibold text-lg text-gray-600">
                        You haven't ordered anything yet
                      </h1>
                      <Link
                        to="/shop"
                        className="border-2 border-myGreen-dark p-2 rounded-md poppins-semibold mt-2 hover:bg-myGreen-dark hover:text-white"
                      >
                        Shop Now
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedAction == "orders" && currentUser?.role == "admin" && (
            <div></div>
          )}

          {selectedAction == "security" && (
            <div>
              <h1 className="poppins-semibold text-myGreen-dark mb-8 ">
                Change Password
              </h1>
              <form
                action=""
                className="flex flex-col gap-4 items-start"
                onSubmit={handleResetPassword}
              >
                <Input
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  id="currentPassword"
                  toggleIsPasswordVisible={setIsCurrentPasswordVisible}
                  isPasswordVisible={isCurrentPasswordVisible}
                />
                <Input
                  type="password"
                  label="New Password"
                  name="password"
                  id="password"
                  toggleIsPasswordVisible={setIsPasswordVisible}
                  isPasswordVisible={isPasswordVisible}
                  ref={password}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  id="confirmPassword"
                  toggleIsPasswordVisible={setIsConfirmPasswordVisible}
                  isPasswordVisible={isConfirmPasswordVisible}
                  onChange={handlePasswordChange}
                />
                {isPasswordMatching == false && (
                  <span className="poppins-regular text-sm text-red-500">
                    Passwords are not same
                  </span>
                )}
                <button
                  disabled={!isPasswordMatching}
                  className="bg-orange-500 py-2 rounded-md text-white poppins-semibold mx-auto mt-4 px-4 disabled:bg-gray-400"
                >
                  {isPendingReset ? (
                    <ProgressSpinner
                      className="size-6 w-[4rem]"
                      strokeWidth="6"
                    />
                  ) : (
                    "Reset"
                  )}
                </button>
              </form>

              <button
                className="bg-red-600 rounded-md poppins-semibold text-md text-white p-2 mt-[4rem]"
                onClick={() => setConfirmationModal(true)}
              >
                <div className="flex gap-2">
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  <span>Delete Account</span>
                </div>
              </button>
            </div>
          )}

          {selectedAction == "notification" && (
            <div className="w-full p-4 flex justify-center items-center flex-col poppins-bold gap-8">
              <img src="/noNotification.png" alt="" className="w-[16rem]" />
              <h1 className="text-gray-600 text-lg">No New Notification</h1>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
