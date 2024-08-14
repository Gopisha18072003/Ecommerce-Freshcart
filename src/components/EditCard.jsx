import { Rating } from "primereact/rating";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export default function EditCard({ data: product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleEditProduct(id) {
    navigate(`/edit-product/${id}`)
  }

  return (
    <div
      className="border-1 surface-border border-round m-2 text-center py-5 px-3 bg-white rounded-md relative  hover:bg-gray-50 "
      id="card"
    >
      <div className="mb-3 h-[12rem]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full rounded-md cursor-pointer"
           crossOrigin="anonymous"
        />
      </div>
      <div className="flex- flex-col items-center justify-center">
        <h4 className="mb-2 poppins-bold text-lg">{product.name}</h4>
        <h6 className="mt-0 mb-4">
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
              <span className="poppins-semibold text-lg bg-myGreen-dark text-white w-[4rem] h-[4rem] block rounded-full text-center p-2 absolute top-[-0.4rem] left-[-0.5rem]">
                {" "}
                {product.discount}% off
              </span>
            </>
          ) : (
            <span>${product.price.toFixed(2)}</span>
          )}
          <span className="text-sm poppins-regular text-gray-400 ml-1">
            {product.parameter}
          </span>
        </h6>
        <div className="flex justify-center gap-2 mb-4">
          <Rating value={product.averageRating} readOnly cancel={false} />
          <span className="poppins-regular text-sm">
            ({product.ratingsQuantity})
          </span>
        </div>
        <button className="poppins-medium border-[2px] border-orange-400 p-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors flex gap-2 mx-auto" onClick={() => handleEditProduct(product._id)}>
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>

          <span>Edit</span>
        </button>
      </div>
    </div>
  );
}
