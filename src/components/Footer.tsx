import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#90C785] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          {/* Copyright */}
          <div className="text-sm md:text-base">
            &copy; {new Date().getFullYear()} Honey Shop. All rights reserved.
          </div>

          {/* Contact Info */}
          <div className="text-sm md:text-base">
            Contact us:&nbsp;
            <a
              href="mailto:info@honeyshop.com"
              className="underline hover:text-white/80 transition"
            >
              info@honeyshop.com
            </a>
          </div>

          {/* Social Media */}
          <div className="flex gap-4 justify-center md:justify-end">
            <a
              href="#"
              className="hover:bg-white/20 p-2 rounded-full transition"
              title="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="#"
              className="hover:bg-white/20 p-2 rounded-full transition"
              title="Twitter"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="#"
              className="hover:bg-white/20 p-2 rounded-full transition"
              title="Instagram"
            >
              <FaInstagram size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
