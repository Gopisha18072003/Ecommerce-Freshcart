import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emptyCartData } from "../store/cart-slice";

export default function Success() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(emptyCartData());
        console.log("Cart Cleared")
    }, []);

    return (
        <div className="mt-[12rem] h-[24rem] flex flex-col items-center justify-center">
            <img src="/success.gif" alt="" className="w-[16rem]"/>
            <h1 className="poppins-semibold text-lg text-green-400">Payment Successfull</h1>
        </div>
    );
}
