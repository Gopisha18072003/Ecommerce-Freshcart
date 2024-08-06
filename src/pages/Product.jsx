import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchProduct, fetchReviews } from "../util/http";
import { ProgressSpinner } from "primereact/progressspinner";
import { Rating } from "primereact/rating";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../store/cart-slice";
import SmoothCarousel from "../ui/SmoothCarousel";
import Error from "../components/Error";

export default function Product() {
  const productId = useParams();
  const {
    data: product,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['product',productId],
    queryFn: ({ signal }) => fetchProduct({ signal, query: productId }),
  });
  const { data: reviews, isPendingReviews } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: ({ signal }) => fetchReviews({ signal, query: productId }),
  });

  const dispatch = useDispatch();

  function handleAddItem(product) {
    dispatch(addItemToCart({ product }));
  }

  return (
    <div className="mt-[12rem] pb-10 bg-gray-100 ">
      {isPending && (
        <div className="flex h-[20rem] items-center">
          <ProgressSpinner className="custom-spinner" />
        </div>
      )}
      {isError && <div className="mt-[12rem]">
        <Error error="No Products found" message="try again later" />
      </div>}
      {!isPending && product && (
        <div className="mt-[10rem]">
          <div className=" flex justify-between bg-white rounded-lg p-4 items-center">
            <div className="flex gap-8">
              <img
                src={`https://freshcart-api-4ftp.onrender.com/uploads/items/${product.image}`}
                alt=""
                className="w-[8rem] h-[8rem] object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex flex-col justify-start ">
                <h1 className="poppins-bold text-lg mb-4">{product.name}</h1>
                <p className="poppins-regular text-gray-400 text-sm">
                  {product.description}
                </p>
                <div className="flex justify-start gap-2 mb-4">
                  <Rating
                    value={product.averageRating}
                    readOnly
                    cancel={false}
                  />
                  <span className="poppins-regular text-sm">
                    ({product.ratingsQuantity})
                  </span>
                </div>
                <div>
                  {product.discount ? (
                    <>
                      <s className="text-sm text-gray-500 poppins-regular">
                        ${product.price.toFixed(2)}
                      </s>{" "}
                      <span className="text-md poppins-semibold text-red-500 ">
                        $
                        {(
                          product.price -
                          (product.price * product.discount) / 100
                        ).toFixed(2)}
                      </span>
                      <span className="text-sm poppins-regular text-gray-400 mr-2">
                        {product.parameter}
                      </span>
                      <span className="poppins-semibold text-sm bg-myGreen-dark text-white rounded-md text-center p-1 ">
                        {" "}
                        {product.discount}% off
                      </span>
                    </>
                  ) : (
                    <span>${product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              className="poppins-medium border-[2px] border-orange-400 p-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
              onClick={() => handleAddItem(product)}
            >
              Add to cart
            </button>
          </div>

          <div>
            <h1 className="poppins-bold text-myGreen-dark text-xl text-center mt-8">
              Reviews
            </h1>
            {!isPendingReviews && reviews && (
              <div >
                <SmoothCarousel avbProducts={reviews} max={4} />
              </div>
            )}
            {isPendingReviews && <ProgressSpinner className="custom-spinner" />}
            {!isPendingReviews && !reviews || reviews.length == 0 && (
                <div className="bg-white rounded-lg w-full h-[12rem] flex justify-center items-center"><h1 className="poppins-semibold text-center"> No reviews</h1></div>
            )}
          </div>
        </div>
      )}
      <div className="h-[8rem]">

      </div>
    </div>
  );
}
