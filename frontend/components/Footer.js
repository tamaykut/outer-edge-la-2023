// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const Footer = () => {
  return (
    <section id="footer">
      <div className="section-container bg-black">
        <div className="flex flex-col  items-center space-y-3 justify-center w-full pt-3 pb-3 md:flex-row md:space-y-0 md:pb-1">
          <div>
            <h3 className="text-white text-xl m-10 font-semibold border-white border-b-2 md:border-b-0 md:mr-4 ">
              <Link href="/">Talking NFTs</Link>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
