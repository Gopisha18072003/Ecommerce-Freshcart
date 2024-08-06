import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emptyCartData } from "../store/cart-slice";
import { useMutation } from "@tanstack/react-query";
import { emptyCart } from "../util/http";

export default function Success() {
    const dispatch = useDispatch();

    const { mutate } = useMutation({
        mutationFn: emptyCart,
        onSuccess: () => {
            dispatch(emptyCartData());

        },
        onError: (error) => {
            console.error("Error emptying cart:", error);
        }
    });

    useEffect(() => {

        mutate();
    }, [mutate]);

    return (
        <div className="mt-[12rem] h-[24rem] flex flex-col items-center justify-center">
            <img src="/success.gif" alt="" className="w-[16rem]"/>
            <h1 className="poppins-semibold text-lg text-green-400">Payment Successfull</h1>
        </div>
    );
}
