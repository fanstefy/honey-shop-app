import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://sendcontactemail-bhxacso2hq-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok && result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        console.log("Email sent successfully!");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Unknown error occurred");
        console.error("Server error:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("error");
      setErrorMessage("Network error - please check your connection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
      </Helmet>

      <div className="md:min-w-[540px] mx-auto items-center mb-[100px] mt-8 px-5">
        <h1 className="text-4xl font-bold text-center my-8">
          {t("contact:contactUs")}
        </h1>

        <div className="mx-auto bg-white shadow-md rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact:name")} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={t("contact:yourName") || "Vaše ime"}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact:email")} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={t("contact:yourEmail") || "vase@email.com"}
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact:message")} *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
                placeholder={t("contact:yourMessage") || "Vaša poruka..."}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-3xl font-medium transition duration-300 bg-gradient-to-r from-yellow-400 to-orange-400 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Šalje se...
                  </span>
                ) : (
                  t("contact:submit") || "Pošalji poruku"
                )}
              </button>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      {t("contact:success") ||
                        "Poruka je uspešno poslata! Javićemo vam se uskoro."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      {errorMessage ||
                        t("contact:error") ||
                        "Greška pri slanju poruke. Molimo pokušajte ponovo."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
            <p className="text-sm">{t("contact:contactUsDirectly")}</p>
            <p className="text-sm font-medium">
              {t("contact:email")}: nektarika.info@gmail.rs
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
