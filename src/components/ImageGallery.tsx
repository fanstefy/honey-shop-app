import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

// Import slika - dodajte vaše slike ovde
// import beekeeper1 from "../assets/images/beekeeper1.jpg";
// import beekeeper2 from "../assets/images/beekeeper2.jpg";
// import beekeeper3 from "../assets/images/beekeeper3.jpg";
// import beekeeper4 from "../assets/images/beekeeper4.jpg";
// import beekeeper5 from "../assets/images/beekeeper5.jpg";
// import beekeeper6 from "../assets/images/beekeeper6.jpg";
// import beekeeper7 from "../assets/images/beekeeper7.jpg";
// import beekeeper8 from "../assets/images/beekeeper8.jpg";
// import beekeeper9 from "../assets/images/beekeeper9.jpg";
// import beekeeper10 from "../assets/images/beekeeper10.jpg";

import beekeeper1 from "../assets/images/pcelinjak_0.jpg";
import beekeeper2 from "../assets/images/pcelinjak_1.jpg";
import beekeeper3 from "../assets/images/pcelinjak_2.jpg";
import beekeeper4 from "../assets/images/pcelinjak_3.jpg";
import beekeeper5 from "../assets/images/pcelinjak_4.jpg";
import beekeeper6 from "../assets/images/pcelinjak_5.jpg";
import beekeeper7 from "../assets/images/pcelinjak_6.jpg";
import beekeeper8 from "../assets/images/pcelinjak_7.jpg";
import beekeeper9 from "../assets/images/pcelinjak_8.jpg";
import beekeeper10 from "../assets/images/pcelinjak_9.jpg";
import beekeeper11 from "../assets/images/pcelinjak_10.jpg";
import beekeeper12 from "../assets/images/pcelinjak_11.jpg";
import { useTranslation } from "react-i18next";

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const { t } = useTranslation();

  // Minimum swipe distance (in px) to trigger swipe
  const minSwipeDistance = 50;

  // Sample images - zamenite sa vašim slikama
  const galleryImages = [
    {
      id: 1,
      src: beekeeper1,
      alt: "Wildflower honey production",
      title: t("home:natureInServiceOfBeekeeping"),
    },
    {
      id: 2,
      src: beekeeper2,
      alt: "Beehive in nature",
      title: t("home:regularInspectionOfHives"),
    },
    {
      id: 3,
      src: beekeeper3,
      alt: "Honey harvest process",
      title: t("home:hiveMaintenance"),
    },
    {
      id: 4,
      src: beekeeper4,
      alt: "Organic certification",
      title: t("home:calmBeesHealthyBees"),
    },
    {
      id: 5,
      src: beekeeper5,
      alt: "Beekeeper at work",
      title: t("home:winterHoneyForBees"),
    },
    {
      id: 6,
      src: beekeeper6,
      alt: "Honey jar collection",
      title: t("home:nectarCarriedByBees"),
    },
    {
      id: 7,
      src: beekeeper7,
      alt: "Manuka honey",
      title: t("home:hiveBaseJastrebac"),
    },
    {
      id: 8,
      src: beekeeper8,
      alt: "Clover honey",
      title: t("home:crowdBeforeFlight"),
    },
    {
      id: 9,
      src: beekeeper9,
      alt: "Clover honey",
      title: t("home:fullFrameOfBees"),
    },
    {
      id: 10,
      src: beekeeper10,
      alt: "Clover honey",
      title: t("home:720mAboveSeaLevel"),
    },
    {
      id: 11,
      src: beekeeper11,
      alt: "Clover honey",
      title: t("home:honeycomb"),
    },
    {
      id: 12,
      src: beekeeper12,
      alt: "Clover honey",
      title: t("home:fullFrameOfBees2"),
    },
  ];

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === "ArrowLeft") {
          goToPrevious();
        } else if (e.key === "ArrowRight") {
          goToNext();
        } else if (e.key === "Escape") {
          closeModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

  // Disable scroll when modal is open
  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const openModal = (imageId: number) => {
    const index = galleryImages.findIndex((img) => img.id === imageId);
    setCurrentIndex(index);
    setSelectedImage(imageId);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex].id);
  };

  const goToPrevious = () => {
    const prevIndex =
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex].id);
  };

  const getCurrentImage = () => galleryImages[currentIndex];

  return (
    <>
      {/* Gallery Section */}
      <section className="container mx-auto py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 tracking-wide">
              {t("home:ourNaturalProcessTitle")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home:ourNaturalProcessDescription")}
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-300"
                onClick={() => openModal(image.id)}
                style={{ height: "200px" }} // <-- ovde kontrolišeš visinu slike
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <h3 className="font-semibold text-sm md:text-base">
                      {image.title}
                    </h3>
                    <p className="text-xs mt-1">
                      {t("home:clickForLargerImage")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors duration-200 z-10"
            aria-label="Close gallery"
          >
            <FaTimes size={24} />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors duration-200 z-10"
            aria-label="Previous image"
          >
            <FaChevronLeft size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors duration-200 z-10"
            aria-label="Next image"
          >
            <FaChevronRight size={32} />
          </button>

          {/* Image Container with Touch Events */}
          <div
            className="relative max-w-4xl max-h-full touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={getCurrentImage().src}
              alt={getCurrentImage().alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
              draggable={false}
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold mb-2">
                {getCurrentImage().title}
              </h3>
              <p className="text-gray-300 text-sm">
                {t("home:image")} {currentIndex + 1} {t("home:of")}{" "}
                {galleryImages.length}
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setSelectedImage(image.id);
                }}
                className={`w-12 h-12 rounded overflow-hidden transition-all duration-200 ${
                  index === currentIndex
                    ? "ring-2 ring-yellow-400"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
