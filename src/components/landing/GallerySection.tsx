import ScrollReveal from "./ScrollReveal";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, alt: "Terraced rice paddies at golden hour", caption: "Terraced Landscapes" },
  { src: gallery2, alt: "Farmer examining wheat crops", caption: "Hands-On Expertise" },
  { src: gallery3, alt: "Agricultural drone over farmland", caption: "Precision Technology" },
  { src: gallery4, alt: "Fresh harvest produce", caption: "Bountiful Harvests" },
  { src: gallery5, alt: "Smart farming sensor in soil", caption: "IoT-Powered Sensing" },
  { src: gallery6, alt: "Farmers working together at sunset", caption: "Community Strength" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="bg-card py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            In the Field
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold text-foreground md:text-5xl">
            A Glimpse of Our World
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <ScrollReveal key={img.caption} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/40" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-5 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="font-display text-lg font-semibold text-primary-foreground">
                    {img.caption}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
