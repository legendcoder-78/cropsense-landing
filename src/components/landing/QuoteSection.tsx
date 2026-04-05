import ScrollReveal from "./ScrollReveal";
import { Quote } from "lucide-react";

const QuoteSection = () => {
  return (
    <section className="bg-card py-24 md:py-32">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <Quote className="mx-auto h-10 w-10 text-harvest/60" />
          <blockquote className="mt-8 font-display text-2xl font-medium italic leading-relaxed text-foreground md:text-3xl lg:text-4xl">
            "The farmer is the only man in our economy who buys everything at
            retail, sells everything at wholesale, and pays the freight both
            ways."
          </blockquote>
          <p className="mt-6 font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            — John F. Kennedy
          </p>
          <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed text-muted-foreground">
            CropSense exists to change this. By putting powerful technology in every
            farmer's hands, we level the playing field and build resilient food systems.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default QuoteSection;
