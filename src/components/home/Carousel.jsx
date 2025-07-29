import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  const slides = [
    {
      image: "https://wallpapers.com/images/high/healthcare-medicine-kinds-hueis0en26wjjmbm.webp",
      fallbackImage: "https://img.freepik.com/free-photo/medicine-capsules-global-health-with-geometric-pattern-digital-remix_53876-126742.jpg",
      title: "Thuốc ARV Chất Lượng",
      description: "Cung cấp đầy đủ các loại thuốc ARV với chất lượng quốc tế"
    },
    {
      image: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
      fallbackImage: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
      title: "Tư Vấn Chuyên Môn",
      description: "Đội ngũ dược sĩ giàu kinh nghiệm luôn sẵn sàng hỗ trợ"
    },
    {
      image: "https://wallpapers.com/images/high/healthcare-symbols-blue-9f5arq1i27if6abf.webp",
      fallbackImage: "https://img.freepik.com/free-photo/medical-banner-with-doctor-working-hospital_23-2149611195.jpg",
      title: "Dịch Vụ Tận Tâm",
      description: "Cam kết mang đến trải nghiệm tốt nhất cho khách hàng"
    },
    {
      image: "https://wallpapers.com/images/featured/healthcare-oco8w27tkw40cp90.jpg",
      fallbackImage: "https://img.freepik.com/free-photo/medical-banner-with-doctor-working-hospital_23-2149611195.jpg",
      title: "Hỗ Trợ 24/7",
      description: "Luôn sẵn sàng phục vụ và tư vấn mọi lúc mọi nơi"
    }
  ];

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
              src={imageErrors[index] ? slide.fallbackImage : slide.image}
              alt={slide.title}
              loading="lazy"
              onError={() => handleImageError(index)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500 translate-y-0">
              <h2 className="text-3xl font-bold mb-2 transform transition-all duration-500 translate-y-0 opacity-100">
                {slide.title}
              </h2>
              <p className="text-lg text-gray-200 transform transition-all duration-500 translate-y-0 opacity-100">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 transform ${
          isHovered ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
        }`}
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 transform ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
        }`}
        aria-label="Next slide"
      >
        <FaChevronRight className="w-6 h-6" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className={`absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'
        }`}
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
      </button>

      {/* Slide indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-8 left-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-12 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60 w-8'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            transition: isPlaying ? 'width 5s linear' : 'none'
          }}
        />
      </div>
    </div>
  );
}