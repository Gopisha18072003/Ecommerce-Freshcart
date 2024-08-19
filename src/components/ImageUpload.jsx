import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentUser, setModalStore, clearModal} from "../store/auth-slice";
import { setIsProfileUploading } from "../store/ui-slice";

const ImageUpload = (props) => {
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const pickedHandler = async (event) => {
    setIsProfileUploading(true)
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
    if(result == null) {
      dispatch(setModalStore("Image should be less than 500KB"));
        setTimeout(() => {
          dispatch(clearModal());
        }, 3000);
    }
    dispatch(updateCurrentUser({"image": result.data["image"] }));
    setIsProfileUploading(false);
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
      <div className="">
        <button
          type="button"
          onClick={pickImageHandler}
          className="bg-myGreen-dark h-[2rem] w-[2rem] rounded-full relative top-[-2rem] left-[6rem]"
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

export default ImageUpload;
