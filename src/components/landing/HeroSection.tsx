import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 font-body text-sm font-semibold uppercase tracking-[0.3em] text-harvest"
        >
          Intelligent Agriculture
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl font-display text-5xl font-bold leading-tight text-primary-foreground md:text-7xl lg:text-8xl"
        >
          Grow Smarter,{" "}
          <span className="italic text-harvest">Harvest</span> Better
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 max-w-xl font-body text-lg leading-relaxed text-primary-foreground/80"
        >
          CropSense empowers farmers with AI-driven insights to maximize yield,
          minimize waste, and build a food-secure future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#gallery"
            className="rounded-full bg-primary px-8 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:scale-105"
          >
            Explore
          </a>
          <a
            href="#stats"
            className="rounded-full border border-primary-foreground/30 px-8 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
          >
            Our Impact
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10"
        >
          <a href="#about" className="animate-bounce inline-block text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowDown className="h-6 w-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
