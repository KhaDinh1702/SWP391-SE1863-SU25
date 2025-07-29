import { useRef, useEffect, useState } from "react";
import doctorsData from "../../data/doctorsData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function DoctorCarousel() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const extendedDoctors = [...doctorsData, ...doctorsData]; // để tạo cảm giác loop mượt

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollSpeed = 1;
    let animationFrame;

    const smoothScroll = () => {
      if (!isPaused) {
        container.scrollLeft += scrollSpeed;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(smoothScroll);
    };

    animationFrame = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Nút trái */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-md"
      >
        <FaChevronLeft className="text-blue-600" />
      </button>

      {/* Nút phải */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-md"
      >
        <FaChevronRight className="text-blue-600" />
      </button>

      {/* Nội dung carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar scroll-smooth space-x-6 px-12 py-4"
      >
        {extendedDoctors.map((doc, index) => (
          <div
            key={index}
            className="min-w-[280px] max-w-[280px] bg-white border border-blue-100 rounded-xl shadow-md"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-full h-72 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg text-blue-800 mb-1">{doc.name}</h3>
              <p className="text-gray-600 text-sm">{doc.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
