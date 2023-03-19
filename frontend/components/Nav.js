import { ConnectButton } from "@rainbow-me/rainbowkit";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  return (
    <nav className={`flex flex-row bg-transparent mt-5 pt-5 pb-1 px-1 w-full justify-between items-center fixed top-0 z-50 duration-500 ease-in-out lg:py-0 lg-px-0`} style={{ justifyContent: 'space-between' }}>
      <div className="flex items-center">
    {/* Logo - Title */}
    <div className="mx-5 p-5">
      <div className="inline-block rounded-full bg-black hover:bg-gray-500 transition-all duration-300 transform hover:scale-110">
        <Link legacyBehavior href="/">
          <a className="text-xl font-bold text-white inline-block whitespace-nowrap uppercase mx-5 my-3">
            User
            </a>
          </Link>
        </div>
      </div>
    
      <div className="mx-5 p-5">
        <div className="inline-block rounded-full bg-black hover:bg-gray-500 transition-all duration-300 transform hover:scale-110">
          <Link legacyBehavior href="/Ad">
            <a className="text-xl font-bold text-white inline-block whitespace-nowrap uppercase mx-5 my-3">
              Advertiser
            </a>
          </Link>
        </div>
      </div>
    

        {/*  Hamburger Menu  */}
        <button
          className="text-white cursor-pointer text-xl leading-none p-5 m-5 border border-solid border-transparent bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <FontAwesomeIcon icon={faBars} width="24px" className="text-white" />
        </button>
      </div>

      <div
        className={
          "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none" +
          (navbarOpen ? " block rounded shadow-lg" : " hidden")
        }
        id="nav-drop"
      >
        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
        <div className="mx-5 p-5">
        <div className="inline-block rounded-full bg-black hover:bg-red-500 transition-all duration-300 transform hover:scale-110">
          <ConnectButton showBalance={false} />
        </div>
</div>
  </ul>
  </div>
  </nav>
  );
};

export default Header;

