import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";
import { AiOutlineFileProtect } from "react-icons/ai";
import { BiRecycle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Footer: React.FC = () => {
  const footerLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerLinksRef.current, {
        x: -20,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="" role="contentinfo">
      <div className="bg-[#90C785] text-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-8 md:gap-0 justify-around">
          {/* Column 1: About Us */}
          <section className="w-full md:w-1/3" aria-labelledby="footer-about">
            <h3 id="footer-about" className="text-xl font-semibold mb-4">
              About Us
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Vanalaya was founded on a passion for quality, value and health of
              people. Our mission is to improve the quality of people's lives by
              offering the freshest, most nutrient-dense food on the planet.
            </p>
            <div className="flex gap-4 mt-4" aria-label="Social media links">
              <a
                href="#"
                className="hover:bg-white/20 p-2 rounded-full transition"
                title="Facebook"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="#"
                className="hover:bg-white/20 p-2 rounded-full transition"
                title="Twitter"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="#"
                className="hover:bg-white/20 p-2 rounded-full transition"
                title="Instagram"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </section>

          {/* Column 2: Certifications & Contact */}
          <section
            className="w-full md:w-1/3 px-0 md:px-6"
            aria-labelledby="footer-certifications"
          >
            <h3
              id="footer-certifications"
              className="text-xl font-semibold mb-4"
            >
              Why Choose Us
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li role="listitem" className="flex items-center gap-2">
                <MdPrivacyTip className="text-white" /> Certified Organic
              </li>
              <li role="listitem" className="flex items-center gap-2">
                <AiOutlineFileProtect className="text-white" /> Guaranteed
                Quality
              </li>
              <li role="listitem" className="flex items-center gap-2">
                <BiRecycle className="text-white" /> Zero Chemical
              </li>
            </ul>
            <address className="text-sm mt-4 not-italic">
              If you have any business queries, please contact us at:
              <br />
              <a
                href="mailto:predolac_stefan@yahoo.com"
                className="underline hover:text-white/80 transition"
              >
                predolac_stefan@yahoo.com
              </a>
            </address>
          </section>

          {/* Column 3: Site Links */}
          <nav
            ref={footerLinksRef}
            aria-labelledby="footer-links"
            role="navigation"
          >
            <h3 id="footer-links" className="text-xl font-semibold mb-4">
              Site Links
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li role="listitem">
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li role="listitem">
                <Link to="/terms-of-service" className="hover:underline">
                  Terms Of Service
                </Link>
              </li>
              <li role="listitem">
                <Link to="/return-refunds" className="hover:underline">
                  Return & Refunds
                </Link>
              </li>
              <li role="listitem">
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="text-center my-2 text-xs">
        &copy; {new Date().getFullYear()} Stefan. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
