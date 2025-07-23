'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const heroImages = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?w=1200',
    title: { en: 'Excellence in Education', bn: 'শিক্ষায় উৎকর্ষতা' },
    subtitle: { en: 'Nurturing minds, building futures', bn: 'মন গড়ি, ভবিষ্যৎ গড়ি' }
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/159740/library-la-trobe-study-students-159740.jpeg?w=1200',
    title: { en: 'Modern Learning Environment', bn: 'আধুনিক শিক্ষা পরিবেশ' },
    subtitle: { en: 'State-of-the-art facilities for better learning', bn: 'উন্নত শিক্ষার জন্য আধুনিক সুবিধা' }
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?w=1200',
    title: { en: 'Dedicated Teachers', bn: 'নিবেদিত শিক্ষকবৃন্দ' },
    subtitle: { en: 'Experienced educators committed to student success', bn: 'শিক্ষার্থীদের সফলতার জন্য অভিজ্ঞ শিক্ষক' }
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-xl shadow-2xl">
      {heroImages.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.image}
              alt={slide.title[language]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                  {slide.title[language]}
                </h1>
                <p className="text-lg md:text-xl opacity-90 animate-fade-in-delay">
                  {slide.subtitle[language]}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}