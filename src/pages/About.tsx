const About: React.FC = () => {
  return (
    <div className="container mx-auto items-center py-10 px-5 min-h-screen">
      <h1 className="text-4xl font-bold text-center my-8">About Us</h1>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to Honey Shop
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At Honey Shop, we are passionate about providing the finest honey
            products sourced from local beekeepers. Our mission is to bring you
            the purest and most delicious honey while supporting sustainable and
            ethical practices.
          </p>
        </section>

        {/* Our Mission Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We believe in the power of nature and the importance of preserving
            our environment. That’s why we work closely with local farmers and
            beekeepers to ensure our honey is sustainably harvested and of the
            highest quality.
          </p>
        </section>

        {/* Why Choose Us Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>100% pure and natural honey.</li>
            <li>Ethically sourced from local beekeepers.</li>
            <li>
              Commitment to sustainability and environmental preservation.
            </li>
            <li>Wide variety of honey products to suit every taste.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
