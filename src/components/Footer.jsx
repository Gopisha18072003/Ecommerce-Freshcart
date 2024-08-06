import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faMessage, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return <div>
  <div className="h-[200px] w-full md:px-12 p-4 px-8 flex md:gap-4 text-start lg:gap-24 justify-center gap-1 poppins-regular border-t-4 border-gray-200">
    <div>
        <h1 className="text-myGreen-dark md:text-md lg:text-xl border-b-2 border-myGreen-dark text-start mb-2 font-bold text-[0.7rem]">Quick Links</h1>
        <ul className="text-black flex flex-col gap-1 items-start md:text-sm text-[0.6rem]">
            <li className="hover:text-myGreen-dark cursor-pointer">Home</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Shop</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Orders</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Shopping Cart</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Whislist</li>
        </ul>
    </div>
    <div>
        <h1 className="text-myGreen-dark md:text-md lg:text-xl border-b-2 border-myGreen-dark text-start mb-2 font-bold text-[0.7rem]">Information</h1>
        <ul className="text-black flex flex-col gap-1 items-start md:text-sm text-[0.6rem]">
            <li className="hover:text-myGreen-dark cursor-pointer">About Us</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Privacy Policy</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Refund Policy</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Terms and Conditions</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Contact Us</li>
        </ul>
    </div>
    <div>
        <h1 className="text-myGreen-dark md:text-md lg:text-xl border-b-2 border-myGreen-dark text-start mb-2 font-bold text-[0.7rem]">Categories</h1>
        <div className="flex lg:gap-12 md:gap-8 gap-4">
        <ul className="text-black flex flex-col gap-1 items-start md:text-sm text-[0.6rem]">
            <li className="hover:text-myGreen-dark cursor-pointer">Fruits</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Vegetables</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Meats</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Sea Foods</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Dairy</li>
        </ul>
        <ul className="text-black flex flex-col gap-1 items-start md:text-sm text-[0.6rem]">
            <li className="hover:text-myGreen-dark cursor-pointer">Poultry</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Frozen</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Organic</li>
            <li className="hover:text-myGreen-dark cursor-pointer">Groceries</li>
        </ul>
        </div>
        
    </div>
    <div>
        
        <h1 className="text-myGreen-dark md:text-m lg:text-xl border-b-2 border-myGreen-dark text-start mb-2 font-bold text-[0.7rem]">About Store</h1>
        <ul className="text-black flex flex-col gap-1 items-start text-start md:text-sm text-[0.6rem]">
            <li>
                <div >
                    <FontAwesomeIcon icon={faPhone} className="text-myGreen-dark mr-2"/>
                    <span>+91 2322786190</span>
                </div>
            </li>
            <li>
            <div>
                    <FontAwesomeIcon icon={faMessage} className="text-myGreen-dark mr-2"/>
                    <span>gopishaw111@gmail.com</span>
                </div>
            </li>
            <li>
            <div>
                    <FontAwesomeIcon icon={faLocationPin} className="text-myGreen-dark mr-2"/>
                    <span>756-East College Para</span>
                    <span>Raniganj, West Bengal</span>
                </div>
            </li>
            <li>
                <div className="text-myGreen-dark flex gap-4 mt-4 md:text-2xl text-lg">
                    <FontAwesomeIcon icon={faFacebook} className="hover:text-green-700 cursor-pointer"/>
                    <FontAwesomeIcon icon={faInstagram} className="hover:text-green-700 cursor-pointer"/>
                    <FontAwesomeIcon icon={faLinkedin} className="hover:text-green-700 cursor-pointer"/>
                    <FontAwesomeIcon icon={faGithub} className="hover:text-green-700 cursor-pointer"/>
                </div>
            </li>
        </ul>
    </div>
    
  </div>
  <div className="bg-myGreen-dark text-white text-center"><span >copyright &copy; gopikumarshaw</span></div>
  </div>
}
