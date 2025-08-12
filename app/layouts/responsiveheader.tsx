import React from "react"

type Props = {
  open: boolean;
};

const Responsiveheader = ({ open }: Props) =>{

    return(
        <div className={`${open ? "left-0" : "-left-[100%]"} bg-white fixed bottom-0 top-0 z-20 h-screen w-[75%] justify-between
         px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}>
            
            <nav className="mt-14">
                <ul className="flex flex-col gap-16 items-start font-semibold text-gray-800 text-2xl">
                    <li>A</li>
                    <li>B</li>
                    <li>C</li>
                    <li>D</li>
                </ul>
            </nav>
        </div>
    )
}

export default Responsiveheader;