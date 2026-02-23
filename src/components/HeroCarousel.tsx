import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../components/ui/carousel';

const heroImages = [
  { src: '/images/hero_1.svg', alt: 'Hero 1' },
  { src: '/images/hero_2.svg', alt: 'Hero 2' },
  { src: '/images/hero_3.svg', alt: 'Hero 3' },
];

const heroTexts = [
  ['Welcome to', 'Booky'],
  ['Discover Your', 'Next Favorite Book'],
  ['Read, Learn,', 'and Grow Together'],
];

const heroTextColors = ['#8CB6FF', '#FFD580', '#7EE5D9'];

const HeroCarousel: React.FC = () => {
  const [embla, setEmbla] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelectedIndex(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    onSelect();
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  React.useEffect(() => {
    if (!embla) return;
    const interval = setInterval(() => {
      if (!embla) return;
      const next = (embla.selectedScrollSnap() + 1) % heroImages.length;
      embla.scrollTo(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [embla]);
    const getMaxWidth = () => {
    if (window.innerWidth < 768) {
      return '100vw';
    }
    return 'calc(100vw - 240px)';
  };

  const [maxWidth, setMaxWidth] = React.useState(getMaxWidth());
  React.useEffect(() => {
    const handleResize = () => setMaxWidth(getMaxWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col items-center" style={{ position: 'relative' }}>
      {/* Carousel Image*/}
      <div
        className="relative overflow-hidden rounded-xl md:rounded-4xl bg-white shadow w-full aspect-[2048/753]"
        style={{
          maxWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
      <Carousel className="w-full h-full" opts={{ loop: true }} setApi={setEmbla}>
        <CarouselContent>
          {heroImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative w-full h-full">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-contain rounded-xl md:rounded-4xl transition-all"
                  style={{ background: '#eaf1fb' }}
                />
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <svg
                      width="100%"
                      height="210"
                      viewBox="0 0 900 210"
                      style={{ maxWidth: 900 }}
                      aria-hidden="true"
                    >
                    <text
                      x="50%"
                      y="38%"
                      textAnchor="middle"
                      fontFamily="'Poppins', 'Quicksand', Arial, sans-serif"
                      fontWeight="700"
                      fontSize="82.52"
                      fill={heroTextColors[idx]}
                      stroke="#fff"
                      strokeWidth="14"
                      strokeLinejoin="round"
                      dominantBaseline="middle"
                      paintOrder="stroke fill"
                    >
                      {heroTexts[idx][0]}
                    </text>
                    <text
                      x="50%"
                      y="38%"
                      dy="92.52"
                      textAnchor="middle"
                      fontFamily="'Poppins', 'Quicksand', Arial, sans-serif"
                      fontWeight="700"
                      fontSize="82.52"
                      fill={heroTextColors[idx]}
                      stroke="#fff"
                      strokeWidth="14"
                      strokeLinejoin="round"
                      dominantBaseline="middle"
                      paintOrder="stroke fill"
                    >
                      {heroTexts[idx][1]}
                    </text>
                    </svg>
                  </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      </div>
      {/* Dots */}
      <div
        className="flex justify-center items-center gap-2 mt-4"
        style={{
          width: '100%',
          background: 'transparent',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => embla && embla.scrollTo(idx)}
            style={{
              width: 10,
              height: 10,
              background: selectedIndex === idx ? '#2563eb' : '#d1d5db',
              borderRadius: '50%',
              border: 'none',
              margin: '0 4px',
              transition: 'background 0.2s',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: selectedIndex === idx ? '0 0 0 2px #2563eb22' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
