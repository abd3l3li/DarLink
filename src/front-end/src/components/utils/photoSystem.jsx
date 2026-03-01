import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const orientationConfig = {
  vertical: {
    carousel: "w-[120px]",
    content: "h-[360px]",
    previous: "left-1/2 -translate-x-1/2 -top-8 rotate-90",
    next: "left-1/2 -translate-x-1/2 -bottom-8 rotate-90",
  },
  horizontal: {
    carousel: "w-[460px]",
    content: "h-[120px]",
    previous: "top-1/2 -translate-y-1/2 -left-8",
    next: "top-1/2 -translate-y-1/2 -right-8",
  },
};

export default function PhotoSystem({ photos, orientation, onClick = () => {} }) {
  const config = orientationConfig[orientation];

  return (
    <Carousel
      orientation={orientation}
      opts={{ align: "start", loop: true }}
      className={config.carousel}
    >
      <CarouselContent className={config.content}>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="h-full p-2">
                <img
                  src={photo.url}
                  alt={photo.alt || `photo-${index}`}
                  className="w-full h-full object-cover rounded-xl"
                  draggable={false}
                  onClick={() => onClick(index)}
                />
              </div>
            </CarouselItem>
          ))
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="h-full p-2">
                <div className="w-full h-full rounded-xl bg-[var(--color-border-gray)] 
                                flex items-center justify-center text-sm text-[var(--color-muted)]">
                  Photo
                </div>
              </div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      
      <CarouselPrevious className={config.previous} />
      <CarouselNext className={config.next} />
    </Carousel>
  );
}