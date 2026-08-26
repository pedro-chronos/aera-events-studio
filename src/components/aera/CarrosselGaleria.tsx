import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GALERIA } from "@/data/galeria";

export function CarrosselGaleria() {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent className="-ml-3">
        {GALERIA.map((foto) => (
          <CarouselItem key={foto.src} className="basis-4/5 pl-3 sm:basis-1/2 lg:basis-1/3">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-aera">
              <img
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
              />
              <div className="gradient-aera pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-15" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-2 border-serenity/40 bg-creme/80 text-grafite backdrop-blur md:-left-5" />
      <CarouselNext className="-right-2 border-serenity/40 bg-creme/80 text-grafite backdrop-blur md:-right-5" />
    </Carousel>
  );
}
