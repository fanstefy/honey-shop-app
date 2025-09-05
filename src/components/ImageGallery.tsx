import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

// Import slika - dodajte vaše slike ovde
import beekeeper1 from "../assets/images/beekeeper1.jpg";
import beekeeper2 from "../assets/images/beekeeper2.jpg";
import beekeeper3 from "../assets/images/beekeeper3.jpg";
import beekeeper4 from "../assets/images/beekeeper4.jpg";
import beekeeper5 from "../assets/images/beekeeper5.jpg";
import beekeeper6 from "../assets/images/beekeeper6.jpg";
import beekeeper7 from "../assets/images/beekeeper7.jpg";
import beekeeper8 from "../assets/images/beekeeper8.jpg";
import beekeeper9 from "../assets/images/beekeeper9.jpg";
import beekeeper10 from "../assets/images/beekeeper10.jpg";

// Sample images - zamenite sa vašim slikama
const galleryImages = [
  {
    id: 1,
    src: beekeeper1,
    alt: "Wildflower honey production",
    title: "Wildflower Honey",
  },
  {
    id: 2,
    src: beekeeper2,
    alt: "Beehive in nature",
    title: "Natural Beehives",
  },
  {
    id: 3,
    src: beekeeper3,
    alt: "Honey harvest process",
    title: "Honey Harvesting",
  },
  {
    id: 4,
    src: beekeeper4,
    alt: "Organic certification",
    title: "Organic Certified",
  },
  {
    id: 5,
    src: beekeeper5,
    alt: "Beekeeper at work",
    title: "Expert Beekeepers",
  },
  {
    id: 6,
    src: beekeeper6,
    alt: "Honey jar collection",
    title: "Premium Collection",
  },
  {
    id: 7,
    src: beekeeper7,
    alt: "Manuka honey",
    title: "Manuka Honey",
  },
  {
    id: 8,
    src: beekeeper8,
    alt: "Clover honey",
    title: "Clover Honey",
  },
  {
    id: 9,
    src: beekeeper9,
    alt: "Clover honey",
    title: "Clover Honey",
  },
  {
    id: 10,
    src: beekeeper10,
    alt: "Clover honey",
    title: "Clover Honey",
  },
];

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 tracking-wide">
              Our Natural Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From beehive to your table - discover the journey of our premium
              organic honey through these beautiful moments captured at our
              facilities.
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
                    <p className="text-xs mt-1">Click to view</p>
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

          {/* Image Container */}
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getCurrentImage().src}
              alt={getCurrentImage().alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold mb-2">
                {getCurrentImage().title}
              </h3>
              <p className="text-gray-300 text-sm">
                Image {currentIndex + 1} of {galleryImages.length}
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
