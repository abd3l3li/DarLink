import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const orientationConfig = {
  vertical: {
    carousel: "md:w-[120px] w-[80px]",
    content: "md:h-[360px] h-[240px]",
    slot: "md:h-[112px] h-[72px]",
    previous: "left-1/2 -translate-x-1/2 -top-8 rotate-90",
    next: "left-1/2 -translate-x-1/2 -bottom-8 rotate-90",
  },
  horizontal: {
    carousel: "md:w-[460px] w-[300px]",
    content: "md:h-[120px] h-[80px]",
    slot: "md:h-[104px] h-[64px]",
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
              <div className={`p-2 ${config.slot}`}>
                <img
                  src={photo}
                  alt={typeof photo === "string" ? `photo-${index}` : photo?.alt || `photo-${index}`}
                  className="w-full h-full object-cover rounded-xl min-h-0"
                  draggable={false}
                  onClick={() => onClick(index)}
                />
              </div>
            </CarouselItem>
          ))
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className={`p-2 ${config.slot}`}>
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