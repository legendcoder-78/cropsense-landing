import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "2.5M+", label: "Acres Monitored", suffix: "" },
  { value: "40%", label: "Water Savings", suffix: "" },
  { value: "12K+", label: "Farmers Empowered", suffix: "" },
  { value: "98%", label: "Crop Health Accuracy", suffix: "" },
];

const StatsSection = () => {
  return (
    <section id="stats" className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="text-center font-body text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Impact
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold text-foreground md:text-5xl">
            Numbers That Matter
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.12}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl border border-border bg-card p-8 text-center transition-shadow duration-300 hover:shadow-lg"
              >
                <p className="font-display text-4xl font-bold text-primary md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 font-body text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
