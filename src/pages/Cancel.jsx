export default function Cancel() {
    return (
        <div className="mt-[10rem] h-[24rem] flex flex-col items-center justify-center">
            <img src="/cancel.gif" alt="" className="w-[12rem]"/>
            <h1 className="poppins-semibold text-lg text-red-500">Payment Canceled</h1>
        </div>
    )
}