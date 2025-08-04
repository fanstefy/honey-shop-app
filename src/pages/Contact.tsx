import Helmet from "react-helmet";

const Contact: React.FC = () => {
  return (
    <div className="max-w-md w-full mx-auto items-center mb-[100px] mt-8 px-5">
      <Helmet>
        <title>Contact Us | Nektarika</title>
        <meta
          name="description"
          content="Get in touch with Nektarika. We'd love to hear from you! Contact us for inquiries, support, or feedback regarding our organic honey products."
        />
        <link rel="canonical" href="https://www.nektarika.rs/contact" />

        <meta property="og:title" content="Contact Us | Nektarika" />
        <meta
          property="og:description"
          content="Reach out to Nektarika with any questions, feedback, or support needs. We're here to help!"
        />
        <meta property="og:url" content="https://www.nektarika.rs/contact" />
        <meta
          property="og:image"
          content="https://www.nektarika.rs/images/cover.jpg"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact Us | Nektarika",
              "url": "https://www.nektarika.rs/contact",
              "description": "Get in touch with Nektarika for product inquiries or support."
            }
          `}
        </script>
      </Helmet>

      <h1 className="text-4xl font-bold text-center my-8">Contact Us</h1>
      <div className="mx-auto bg-white shadow-md rounded-lg p-8">
        <form className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your Name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your Email"
            />
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your Message"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
