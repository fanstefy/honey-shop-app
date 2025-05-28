const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow-500 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-sm md:text-base">
            &copy; {new Date().getFullYear()} Honey Shop. All rights reserved.
          </p>

          {/* Contact Info */}
          <p className="text-sm md:text-base mt-4 md:mt-0">
            Contact us:{" "}
            <a
              href="mailto:info@honeyshop.com"
              className="underline hover:text-yellow-200"
            >
              info@honeyshop.com
            </a>
          </p>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-yellow-200">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="#" className="hover:text-yellow-200">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="#" className="hover:text-yellow-200">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
