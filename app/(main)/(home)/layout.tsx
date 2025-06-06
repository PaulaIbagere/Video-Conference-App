import React from "react"
import NavBar from "@/components/NavBar"
const HomeLayout = async({
    children
}: {
    children: React.ReactNode
}) =>{
    return(
        <main className="relative">
            <NavBar/>
            <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-w8 max-md:pb-14 sm:px-14 ">
                <div className="w-full">
                    {children}
                </div>

            </section>
        </main>
    )
}

export default HomeLayout