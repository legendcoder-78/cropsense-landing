import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const LoggedOutCTA = () => {
  const { isAuthenticated, openModal } = useAuth();

  if (isAuthenticated) return null;

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-cta">
      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-8"
        >
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-relaxed">
            Enjoying the app so far?<br className="hidden sm:block" /> Sign in to access more powerful features and get the most out of it!
          </h2>
          <button
            onClick={() => openModal("signup")}
            className="rounded-full bg-primary-foreground px-10 py-4 font-body text-sm font-bold text-primary transition-all hover:scale-105 hover:shadow-xl shadow-md"
          >
            GET STARTED
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LoggedOutCTA;
