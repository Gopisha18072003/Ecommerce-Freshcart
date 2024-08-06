import { useNavigate, useParams } from "react-router";
import Input from "../components/Input";
import { useMutation } from "@tanstack/react-query";

import {
  fetchProduct,
  querClient,
  updateProduct,
  uploadProductImage,
  deleteProduct
} from "../util/http";
import ProductImageUpload from "../components/ProductImageUpload";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import Error from "../components/Error";

export default function EditProduct() {
  const productId = useParams();

  const { data: product, isPending, isError } = useQuery({
    queryKey: ["edit-product", productId],
    queryFn: ({ signal }) =>
      fetchProduct({ signal, query: { productId: productId.id } }),
  });

  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModlaVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null)
  const {
    mutate: mutateProduct,
    isPendingProductUpdate,
    isErrorUpdatingProduct,
  } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      setIsUpdating(false);
      setIsUpdated(true);
      setTimeout(() => navigate("/products"), 2000);
    },
    onMutate: async (data) => {
      await querClient.cancelQueries({
        queryKey: ["edit-product", productId.id],
      });
      const previousData = querClient.getQueryData([
        "edit-product",
        productId.id,
      ]);
      querClient.setQueryData(["edit-product", productId.id], data);
      return { previousData };
    },
    onError: (error, data, context) => {
      querClient.setQueryData(
        ["edit-event", productId.id],
        context.previousData
      );
    },
    onSettled: () => {
      querClient.invalidateQueries(["products"]);
      querClient.invalidateQueries(["products", "featured"]);
      querClient.invalidateQueries(["edit-product", productId]);
      querClient.invalidateQueries(["product", productId]);
    },
  });

  function handleUpdateProduct(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (!data["isFeatured"]) {
      data["isFeatured"] = false;
    } else {
      data["isFeatured"] = true;
    }

    data["productId"] = id;
    setIsUpdating(true);

    mutateProduct(data);
  }

  function handleClickDelete() {
    setIsModalVisible(true);
    setIsDeleting(true);
  }

  const {
    mutate: mutateDeleteProduct,
    isPending: deletionPending
  } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      setIsDeleting(false);
      setIsDeleted(true);
      querClient.invalidateQueries({queryKey: ['products'], refetchType: "none"});
      setTimeout(() => navigate("/products"), 2000);
    }
  });

  function handleDeleteProduct() {
    mutateDeleteProduct(productId.id)
  }


  return (
    <div className="mt-[12rem]">
      {
        isPending && (
          <div className="flex w-full h-[20rem] items-center">
            <ProgressSpinner className="custom-spinner"/>
          </div>
        )
      }
      {!isPending && product && (
        <div>
          {isModlaVisible && (
            <div className="fixed top-[40%] left-[38%] z-50 bg-white border-2 border-gay-300 rounded-lg w-[20rem] flex flex-col items-center p-8 gap-4">
              <img src="/sure.gif" alt="are you sure" className="w-[6rem]" />
              <h1 className="poppins-semibold text-lg">Are you sure?</h1>
              <div className="flex gap-12">
                <button className="poppins-regular text-red-500" onClick={handleDeleteProduct}>
                  <div>
                    {
                      deletionPending && <ProgressSpinner className="size-4 stroke-red-500" strokeWidth="4"/>
                    }
                    {
                      !deletionPending && isDeleting && "Okay"
                    }
                    {
                      !deletionPending && isDeleted && 'Deleted'
                    }
                  </div>
                </button>
                <button
                  className="poppins-regular"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsModalVisible(false);
                    setIsDeleting(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="w-[12rem] mx-auto">
            <img
              src={`https://freshcart-api-4ftp.onrender.com/uploads/items/${image|| product.image}`}
              alt=" photo"
              crossOrigin="anonymous"
              className="w-[12rem] h-[12rem] relative object-cover border-4 border-gray-300 rounded-md"
            />

            <ProductImageUpload
              id={productId.id}
              onInput={uploadProductImage}
              setImage= {setImage}
            />
          </div>

          <form
            action=""
            className="w-1/2 mx-auto flex flex-col gap-4 bg-white p-8 rounded-lg "
            onSubmit={(event) => handleUpdateProduct(event, product._id)}
          >
            <div className="">
              <Input
                label="Name"
                type="text"
                id="name"
                name="name"
                value={product.name}
                required={true}
              />
            </div>
            <div className="">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="category"
                  className="poppins-semibold text-gray-700"
                >
                  Category
                </label>
                <div className="border-2 rounded-md border-gray-300 flex items-center pr-2">
                  <input
                    type="text"
                    name="category"
                    id="category"
                    required
                    defaultValue={product.category}
                    disabled
                    className={`poppins-regular p-2 border-none rounded-md w-[90%] outline-none`}
                  />
                </div>
              </div>
            </div>

            <div className="">
              <div className="flex flex-col gap-1 ">
                <label
                  htmlFor="description"
                  className="poppins-semibold text-gray-700"
                >
                  Description
                </label>
                <div className="border-2 rounded-md border-gray-300 flex items-center pr-2">
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={product.description}
                    required={true}
                    className={`poppins-regular p-2 border-none rounded-md w-[100%] outline-none resize-none`}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="">
              <Input
                label="Price"
                type="Number"
                id="price"
                name="price"
                value={product.price}
                required={true}
              />
            </div>
            <div className="">
              <Input
                label="Discount"
                type="Number"
                id="discount"
                name="discount"
                value={product.discount}
                required={true}
              />
            </div>
            <div className="flex gap-5">
              <label
                htmlFor="isFeatured"
                className="poppins-semibold text-gray-700"
              >
                Featured
              </label>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                defaultChecked={product.isFeatured}
                className="w-6 h-6"
              />
            </div>
            <div className="flex justify-center gap-12">
              <button
                className="p-3 bg-myGreen-dark text-white poppins-semibold rounded-md text-lg"
                type="submit"
              >
                {isUpdating && (
                  <ProgressSpinner
                    className=" size-5 stroke-white px-8"
                    strokeWidth="8"
                  />
                )}
                {!isUpdating && isUpdated && (
                  <div className="flex justify-center items-center">
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
                    <span>Updated</span>
                  </div>
                )}
                {!isUpdating && !isUpdated && <span>Update</span>}
              </button>
            </div>
          </form>
          <div className=" flex justify-center py-8">
          <button
            className="p-3 bg-red-500 text-white poppins-semibold rounded-md text-lg"
            type="button "
            onClick={(event) => {
              event.stopPropagation();
              handleClickDelete();
            }}
          >
            {isDeleting && (
              <ProgressSpinner
                className=" size-5 stroke-white px-8"
                strokeWidth="8"
              />
            )}
            {!isDeleting && isDeleted && (
              <div className="flex justify-center items-center w-full">
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
                <span>Deleted</span>
              </div>
            )}
            {!isDeleting && !isDeleted && (
              <span className="flex gap-2">
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
                Delete
              </span>
            )}
          </button>
          </div>
        </div>
      )}
      {
        isError && (
          <div>
            <Error error="No Product Found" description="try again later" />
          </div>
        )
      }
      <div className="w-[8rem]">

      </div>
    </div>
  );
}
