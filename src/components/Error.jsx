export default function Error({error, description}) {
    return (
        <div className="mt-[12rem] w-full">
            <div className="flex flex-col items-center">
                <img src="/500error.gif" alt="" className="w-[16rem]"/>
                <h1 className="poppins-bold text-xl text-red-500">{error}</h1>
                <p className="poppins-regular text-md text-gray-400">{description}</p>
            </div>

            <div className="h-[8rem]"></div>
        </div>
    )
}