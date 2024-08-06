export default function ConfirmModal({text, onClickButton}) {
    return (
            <div className="absolute top-[50%] left-[50%] z-10 bg-green-200 rounded-md w-[18rem] h-[8rem] text-center p-2">
            <h3 className="poppins-semibold text-xl ">Are you sure?</h3>
            <div className="flex gap-8 justify-center mt-8 w-full">
            <button onClick={() => onClickButton("okay")} className="poppins-semibold text-white bg-orange-500 rounded-md p-2">{text}</button>
            <button onClick={() => onClickButton("cancel")} className="poppins-semibold text-white bg-myGreen-dark rounded-md p-2">Cancel</button>
            </div>
        </div>
    )
}