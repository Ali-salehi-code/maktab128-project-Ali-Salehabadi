import React,{useState} from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import Responsiveheader from "./responsiveheader";

const Header=()=>{
    const [open,setOpen] = useState(false)
    const toggle =()=>{
        setOpen(!open)
    }
    return(
        <div className="pb-3 pt-5">
             <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-0">
                {/**/}
                
                <nav className="md:flex gap-14 hidden">
                    <ul className="flex gap-16 items-center font-semibold">
                        <li>A</li>
                        <li>B</li>
                        <li>C</li>
                        <li>D</li>
                    </ul>
                    <ul className="flex gap-10 items-center font-semibold">
                        <li>Login</li>
                        <button className="py-1 px-3 border">sign up</button>
                        <select name="" id="">
                            <option value="EN">EN</option>
                        </select>
                    </ul>
                </nav>
                {
                    open ?<Icon icon="jam:menu" width="24" height="24" onClick={toggle} className="text-4xl"/>  :<Icon icon="duo-icons:menu" width="24" height="24"  onClick={toggle}/>

                }
             </div>
             <Responsiveheader open={open}/>
        </div>
    )
}

export default Header;