import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import { querClient } from "../util/http";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../util/http";
import Footer from "../components/Footer";
export default function RootLayout() {
    const {data} = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    return (
        <div className="">
            <MainNavigation products={data} classes='fixed top-0 z-40'/>
            <div className="pt-4 px-8 bg-gray-100 ">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}

export function loader() {
    return querClient.fetchQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 10000
    })
}

