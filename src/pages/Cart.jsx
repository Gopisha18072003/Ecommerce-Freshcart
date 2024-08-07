import { useSelector } from "react-redux";
import CartCard from "../components/CartCard";
import image from "../assets/emptyCart.jpg";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Cart() {

  const cart = useSelector((state) => state.cart);
  const { items, total } = cart;

  const totalPriceWithoutDiscount = items.reduce(
    (acc, item) => (acc += item.product.price * item.quantity),
    0
  );
  const savings = (totalPriceWithoutDiscount - total).toFixed(2);

  const [isProcessing, setIsProcessing] = useState(false);
  // payment integration
  const makePayment = async () => {
    const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
    const stripe = await loadStripe("pk_test_51PCc9nSBggYrNv4RFFHXQAWbiL2m3pI2qO9uxpAsJj6CiugB2Nqo5yclTRndDrLZe0GsjnBN6oaD138ICYLjEtEE00nV4iDUkM");
    setIsProcessing(true);
    const response = await fetch(
      "https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/create-checkout-session",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      }
    );
    const session = await response.json();
    setIsProcessing(false);
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
    setIsProcessing(false);
    if (result.error) {
      console.log("Error in creating session: ");
    }
  };
  return (
    <div className="w-full h-[44rem] bg-gray-100 flex items-center justify-center gap-8">
      <div className="w-[70%] h-[26rem] bg-white mt-[6rem] mb-2 rounded-b-3xl overflow-hidden">
        <div
          id="products"
          className="h-[80%] w-full bg-green-50 overflow-y-auto"
        >
          <div className="flex flex-col w-full h-[20.6rem] bg-white overflow-y-auto">
            {items.length == 0 && (
              <div className="flex flex-col items-center justify-center">
                <img src={image} alt="" className="w-[40%] mx-auto my-0" />
                <Link
                  to="/shop"
                  className="bg-myGreen-light hover:bg-myGreen-dark rounded-md p-2 poppins-semibold text-white"
                >
                  Go back to shop
                </Link>
              </div>
            )}
            <ul>
              {items.length > 0 &&
                items.map((item) => (
                  <li key={item.product._id}>
  
                    <CartCard
                      item={item}
                      classes="flex justify-between items-center w-full mx-auto bg-white border-b-2 border-gray-200"
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="w-full h-[20%] flex justify-end items-center px-12 border-t-2 border-gray-200">
          {isProcessing && (
            <div className="bg-myGreen-dark rounded-md w-[8rem] text-center p-1">
              <ProgressSpinner className=" bg-myGreen-dark size-7 stroke-white rounded-md" strokeWidth="6" />

            </div>
          )}
          {!isProcessing && (
            <button
              className={`bg-myGreen-dark text-white w-[8rem] poppins-bold p-2 rounded-md flex gap-2 ${
                items.length > 0 ? "custom-button" : ""
              } hover:bg-green-600 disabled:bg-gray-400 `}
              disabled={items.length == 0}
              onClick={makePayment}
            >
              Checkout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="size-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div id="priceDetails" className="w-[30%] bg-white rounded-xl">
        <h2 className="poppins-bold text-lg text-gray-500 border-b-2 border-gray-200 px-8 py-4">
          Price Details
        </h2>
        <ul className=" px-8 border-b-2 border-gray-200 py-4 flex flex-col gap-2">
          <li className="flex items-center justify-between">
            <h3 className="poppins-semibold">
              Price{" "}
              <span className="text-sm poppins-regular">({items.length})</span>
            </h3>
            <span className="poppins-regular">
              ${totalPriceWithoutDiscount.toFixed(2)}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <h3 className="poppins-semibold">Discount</h3>
            <span className="poppins-regular text-myGreen-dark">
              - ${savings}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <h3 className="poppins-semibold">Delivery Charges</h3>
            <span className="poppins-regular text-myGreen-dark">Free</span>
          </li>
        </ul>
        <div className="px-8 border-b-2 border-gray-200 py-4 flex justify-between">
          <h2 className="poppins-semibold">Total Amount</h2>
          <span className="poppins-regular">${total.toFixed(2)}</span>
        </div>
        <p className="poppins-regular text-myGreen-dark text-sm px-8 py-2">
          You will save ${savings} on this order
        </p>
      </div>
    </div>
  );
}
