import React, { useRef, useState } from "react";

const ProductImageUpload = (props) => {
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  const pickedHandler = async (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    const result = await props.onInput(props.id, pickedFile, fileIsValid);
    const image = result.data.image.split('\\')[2]
    props.setImage(image)
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="w-full">
        <button
          type="button"
          onClick={pickImageHandler}
          className="bg-myGreen-dark h-[2rem] w-[2rem] rounded-full relative top-[-1rem] left-[10rem]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-4 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ProductImageUpload;
