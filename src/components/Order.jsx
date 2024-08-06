import { useState } from "react";
import { Rating } from "primereact/rating";
import {useMutation} from "@tanstack/react-query"
import {querClient, writeReview} from "../util/http";

export default function Order({ order }) {
  function dateFormatter(date) {
    const givenDate = new Date(date);
    const formattedDate = givenDate.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
    });
    return formattedDate;
  }

  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [inputRating, setInputRating] = useState();
  const [productId, setProductId] = useState('')

  function handleWriteReview(id) {
    setIsReviewFormOpen(true);
    setProductId(id)
  }

  const { mutate } = useMutation({
    mutationFn: writeReview,
    onSuccess: () => {
    }, 
    onError: (error) => {
    },
    onSettled: () => {
      querClient.invalidateQueries(['reviews', productId])
    }
  });
  
  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsReviewFormOpen(false);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data['productId'] = productId;
    data['rating'] = inputRating;
    setProductId('');
    setInputRating(null);
  
  
    mutate(data);
  }
  

  return (
    <div>
      {isReviewFormOpen && (
        <div id="form" className="fixed top-[50%] left-[50%] w-[24rem] h-[13rem] bg-white border-2 border-myGreen-dark rounded-md p-8 ">
          <form action="" onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <Rating value={inputRating} onChange={(e) => setInputRating(e.value)} cancel={false} />
              <div className="flex flex-col">
              <label htmlFor="comment" className="poppins-semibold text-gray-400 text-sm">Comment</label>
              <textarea name="comment" id="comment" className="poppins-semibold text-sm text-gray-700 border-2 border-gray-400 resize-none rounded-md" ></textarea>
              </div>

            <div className=" flex gap-4">
            <button type="submit" className="bg-green-400 hover:bg-green-500 text-white p-1 rounded-md poppins-semibold">Submit</button>
            <button type="button" onClick={() => {setIsReviewFormOpen(false); setInputRating(null)}} className="poppins-semibold hover:text-red-500">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <h1 className="m-0 pl-2 poppins-bold text-xl">
        {dateFormatter(order.createdAt)}
      </h1>
      <ul className="flex flex-col gap-4 p-8">
        {order.productDetails.map((product) => {
          return (
            <li
              key={product.productId}
              className="px-6 flex w-full bg-white rounded-md gap-6 "
            >
              <div className="w-[8rem] h-[8rem]">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-full p-2 "
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex flex-col justify-center items-start w-full gap-4">
                <div className="flex justify-between w-full ">
                  <div>
                    <h2 className="poppins-semibold text-lg text-gray-900 p-0 m-0">
                      {product.name}
                    </h2>
                    <span className="text-sm poppins-regular text-gray-400">
                      x{product.quantity}
                    </span>
                  </div>

                  <h3 className="poppins-regular text-md text-myGreen-dark">
                    $ {(product.price * product.quantity).toFixed(2)}
                  </h3>
                </div>

                <button
                  className="hover:text-myGreen-dark poppins-regular text-md hover:font-medium"
                  onClick={() => handleWriteReview(product.productId)}
                >
                  Write a review
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
