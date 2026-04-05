import ScrollReveal from "./ScrollReveal";
import { Sprout, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Sprout,
    title: "Precision Farming",
    description: "AI-powered crop monitoring delivers real-time insights for optimal growth conditions.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Yield",
    description: "Predictive analytics help forecast harvests and plan resource allocation effectively.",
  },
  {
    icon: Shield,
    title: "Sustainable Practices",
    description: "Reduce water and fertilizer usage while maximizing output and protecting soil health.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Why CropSense
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold text-foreground md:text-5xl">
            Farming, Reimagined
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.15}>
              <div className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
