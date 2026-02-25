import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


export default function PhotoSystem({ photos }) {
  return (
    <Carousel
      orientation="vertical"
      opts={{ align: "start", loop: true }}
      className="w-[120px]"
    >
      <CarouselContent className="h-[360px]">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="h-full p-2">
                <img
                  src={photo.url}
                  alt={photo.alt || `photo-${index}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </CarouselItem>
          ))
        ) 
                        : (
                            // placeholder
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
      
      <CarouselPrevious className="left-1/2 -translate-x-1/2 -top-8 rotate-90" />
      <CarouselNext className="left-1/2 -translate-x-1/2 -bottom-8 rotate-90" />
    </Carousel>
  );
}