import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { Heart, Users, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CTASection = () => {
  const { openModal } = useAuth();

  return (
    <section id="cta" className="relative overflow-hidden py-24 md:py-32 bg-gradient-cta">
      <div className="container relative z-10 mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="mx-auto flex justify-center gap-6 mb-8">
            {[Heart, Users, Globe].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                className="rounded-full bg-primary-foreground/15 p-3"
              >
                <Icon className="h-6 w-6 text-primary-foreground" />
              </motion.div>
            ))}
          </div>

          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            Together, We Can End<br />
            <span className="text-harvest">Food Insecurity</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/80">
            Every acre optimized through CropSense is a step toward feeding the
            world. Join thousands of farmers, researchers, and advocates building
            a future where no one goes hungry.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => openModal("signup")}
              className="rounded-full bg-primary-foreground px-10 py-4 font-body text-sm font-bold text-primary transition-all hover:scale-105 hover:shadow-xl"
            >
              Join the Movement
            </button>
            <a
              href="#stats"
              className="rounded-full border-2 border-primary-foreground/40 px-10 py-4 font-body text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              Learn More
            </a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
