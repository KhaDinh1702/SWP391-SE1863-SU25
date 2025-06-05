import React, { useState, useEffect } from 'react';

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://objstore17034api.superdata.vn/alobacsi-assets/thuoc-ARV.jpg",
    "https://i.pinimg.com/736x/d4/ea/55/d4ea556a1359c33fc7fb5d6c7bbd7d71.jpg",
    "https://i.pinimg.com/736x/41/b5/14/41b5144653f09f48b99625063b9bcafa.jpg",
    "https://i.pinimg.com/736x/12/1f/fd/121ffd0bf46bf2872f80407c9c60d75d.jpg",
    "https://jbi.global/sites/default/files/styles/home_page_carousel_image_style/public/2021-03/CarouselEITP1900wide_1.jpg?h=cd163b2d&itok=k2hZSitm"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl group">
      {/* Carousel wrapper with gradient overlay */}
      <div className="relative h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)] ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              className="w-full h-full object-cover object-center"
              src={slide}
              alt={`Slide ${index + 1}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-8 left-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-12 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60 w-8'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Navigation buttons with hover animation */}
      <button
        type="button"
        className="absolute top-1/2 left-4 z-30 flex items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none shadow-lg"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-4 z-30 flex items-center justify-center w-12 h-12 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none shadow-lg"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Optional slide counter */}
      <div className="absolute bottom-4 right-4 z-30 px-3 py-1 text-sm rounded-full bg-black/30 text-white backdrop-blur-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}