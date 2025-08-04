import React from "react";

const About: React.FC = () => {
  return (
    <div className="mx-auto px-4 py-10 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-yellow-700 mb-10">
        About Our Beekeeping Journey
      </h1>

      {/* Main Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Welcome to Our Honey World
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are passionate beekeepers with over 15 years of experience,
            dedicated to producing <strong>100% pure, organic honey</strong>.
            Our apiaries are nestled at the foot of the majestic
            <strong> Mojsinjske Mountains</strong>, near the serene banks of the
            South Morava River, close to the town of Stalać in central Serbia.
          </p>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Why Choose Our Honey?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>100% organic, raw, and unfiltered honey.</li>
            <li>Sourced from rich floral meadows in unspoiled nature.</li>
            <li>Committed to sustainable and ethical beekeeping.</li>
            <li>Direct from the beekeeper – no middlemen.</li>
          </ul>
        </section>

        {/* Image Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Our Natural Habitat
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <img
              src="/images/nature1.jpg"
              alt="Mojsinjske mountains"
              className="rounded-lg object-cover w-full h-64"
            />
            <img
              src="/images/apiary1.jpg"
              alt="Our apiary"
              className="rounded-lg object-cover w-full h-64"
            />
          </div>
        </section>

        {/* Google Map */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Visit Our Location
          </h2>
          <div className="w-full h-72">
            <iframe
              title="Our Apiary Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2850.081112165246!2d21.418896!3d43.687459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755d2e0b01e0a4b%3A0x1111111111111111!2sStala%C4%87!5e0!3m2!1sen!2srs!4v1687353921456"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg border"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
