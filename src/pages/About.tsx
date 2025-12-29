import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto items-center px-4 py-10 min-h-screen mt-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-700 mb-10 md:text-center px-6">
        {t("about:aboutNektarika")}
      </h1>

      {/* Main Card */}
      <div className="bg-white xs:text-center shadow-lg rounded-lg max-w-5xl mx-auto space-y-8 p-6">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("about:aboutIntroTitle")}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t("about:aboutIntroParagraph")}
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            {t("about:aboutPhilosophyParagraph")}
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            {t("about:aboutPhilosophyParagraph2")}
          </p>
        </section>

        {/* Philosophy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("about:aboutPhilosophyTitle")}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t("about:nektarikaIsNotIndustry")}
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            {t("about:ourProductAreNotHeated")}
          </p>
        </section>

        {/* Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("about:aboutProductsTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {/* <li>Propolis kapi</li>
            <li>Polen</li>
            <li>Vosak</li>
            <li>Krem med</li>
            <li>Sezonske vrste meda (u zavisnosti od godine)</li> */}
            {(
              t("about:aboutProductsList", { returnObjects: true }) as string[]
            ).map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            {t("about:everythingIs100Natural")}
          </p>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("about:aboutWhyChooseTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {/* <li>Preko 10 godina iskustva</li>
            <li>Prirodno okruženje bogato bagremom</li>
            <li>
              Čuvanje prirodnog kvaliteta meda (bez grejanja i industrijske
              obrade)
            </li>
            <li>Mali tim koji radi sa srcem</li>
            <li>Direktna kupovina od pčelara</li>
            <li>Fokus na poverenje i zadovoljstvo kupaca</li> */}
            {(
              t("about:aboutWhyChooseList", { returnObjects: true }) as string[]
            ).map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            {t("about:weBeleaveHoneyIsMoreThanProduct")}
          </p>
        </section>

        {/* Location */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t("about:aboutHabitatTitle")}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {t("about:aboutOurLocation")}
          </p>

          {/* Google Maps Embed */}
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d46185.77325443515!2d21.450799644998444!3d43.6562646278426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2srs!4v1765549795318!5m2!1sen!2srs"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokacija pčelinjaka Nektarika"
              className="grayscale-[20%]"
            />
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>📍 {t("about:ourAddressLabel")}</strong>{" "}
              {t("about:ourAddress")}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>🌳 {t("about:ourSurroundingsLabel")}</strong>{" "}
              {t("about:ourSurroundings")}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>🏔️ {t("about:regionLabel")}</strong> {t("about:region")}
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center pt-6 pb-6">
          <p className="text-gray-600 mb-4">{t("about:contactLabel")}</p>
          <Link to="/contact" className="hover:underline">
            {t("footer:contactUs")}
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
