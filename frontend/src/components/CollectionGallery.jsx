/**
 * Collection Gallery Layouts
 * Three layout styles: Masonry, Uniform Grid, Hero + Thumbnails
 */

/* ════════════════════════════════════════════════════════════════
   STYLE A – Masonry Grid (Editorial/Artistic Moodboard)
════════════════════════════════════════════════════════════════ */
export function MasonryGallery({ images = [], collectionName }) {
  // Assign varying heights for true moodboard effect
  const heights = [
    'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 
    'aspect-[2/3]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]',
    'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]',
    'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'
  ];
  
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
      {images.slice(0, 16).map((img, idx) => (
        <div key={idx} className="break-inside-avoid mb-3 md:mb-4">
          <div className={`relative ${heights[idx % heights.length]} overflow-hidden group cursor-pointer`}>
            {img ? (
              <img 
                src={img} 
                alt={`${collectionName} - Image ${idx + 1}`} 
                loading="lazy" 
                decoding="async"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-90" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200" />
            )}
            <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/20 transition-colors duration-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STYLE B – Uniform Grid 3x3 (Clean Product Display)
════════════════════════════════════════════════════════════════ */
export function UniformGridGallery({ images = [], collectionName }) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {images.slice(0, 9).map((img, idx) => (
        <div key={idx} className="relative aspect-square overflow-hidden group cursor-pointer">
          {img ? (
            <img 
              src={img} 
              alt={`${collectionName} - Image ${idx + 1}`} 
              loading="lazy" 
              decoding="async"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-90" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200" />
          )}
          <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STYLE C – Hero + Thumbnails (Highlight Standout Piece)
════════════════════════════════════════════════════════════════ */
export function HeroThumbnailsGallery({ images = [], collectionName }) {
  const heroImage = images[0];
  const thumbnails = images.slice(1, 5);
  
  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden group cursor-pointer">
        {heroImage ? (
          <img 
            src={heroImage} 
            alt={`${collectionName} - Hero`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {thumbnails.map((img, idx) => (
          <div key={idx} className="relative aspect-square overflow-hidden group cursor-pointer">
            {img ? (
              <img 
                src={img} 
                alt={`${collectionName} - Thumbnail ${idx + 1}`} 
                loading="lazy" 
                decoding="async"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-90" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200" />
            )}
            <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
