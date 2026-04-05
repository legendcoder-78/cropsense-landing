import ScrollReveal from "./ScrollReveal";
import { Sprout, BarChart3, Shield, Map, CloudSun, Truck, TrendingUp, Leaf } from "lucide-react";

const features = [
  {
    icon: Sprout,
    title: "Precision Farming",
    description: "AI-powered crop monitoring delivers real-time insights for optimal growth conditions.",
    gradient: "from-emerald-100 to-green-200",
    iconBg: "bg-emerald-200",
    iconColor: "text-emerald-700",
    borderColor: "border-emerald-300",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Yield",
    description: "Predictive analytics help forecast harvests and plan resource allocation effectively.",
    gradient: "from-blue-200 via-sky-200 to-indigo-200",
    iconBg: "bg-blue-300",
    iconColor: "text-blue-800",
    borderColor: "border-blue-400",
  },
  {
    icon: Shield,
    title: "Sustainable Practices",
    description: "Reduce water and fertilizer usage while maximizing output and protecting soil health.",
    gradient: "from-lime-100 to-green-100",
    iconBg: "bg-lime-200",
    iconColor: "text-lime-700",
    borderColor: "border-lime-300",
  },
  {
    icon: Map,
    title: "Supply Chain Map",
    description: "Interactive visual map showing where crops are grown, transportation routes, and market destinations in real time.",
    gradient: "from-amber-100 to-orange-200",
    iconBg: "bg-amber-200",
    iconColor: "text-amber-700",
    borderColor: "border-amber-300",
  },
  {
    icon: CloudSun,
    title: "Climate Impact Insights",
    description: "Monitor climate patterns and assess environmental impact to adapt farming strategies proactively.",
    gradient: "from-violet-100 to-purple-200",
    iconBg: "bg-violet-200",
    iconColor: "text-violet-700",
    borderColor: "border-violet-300",
  },
  {
    icon: Truck,
    title: "Route Optimization",
    description: "Smart logistics reduce post-harvest losses with optimized transportation from farm to market.",
    gradient: "from-teal-100 to-cyan-200",
    iconBg: "bg-teal-200",
    iconColor: "text-teal-700",
    borderColor: "border-teal-300",
  },
];

const CARD_MIN_HEIGHT = "min-h-[220px]";

const AboutSection = () => {
  return (
    <section id="about" className="bg-gradient-to-b from-white to-emerald-50/40 py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Why CropSense
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-foreground md:text-5xl">
              Farming, <span className="text-gradient-primary">Reimagined</span>
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
              From precision agriculture to climate-smart logistics, CropSense brings cutting-edge AI to every step of the food supply chain.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1} className="flex">
              <div
                className={`group relative overflow-hidden rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.gradient} p-7 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/40 hover:-translate-y-1 flex flex-col h-full w-full ${CARD_MIN_HEIGHT}`}
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
                <div className={`relative mb-5 inline-flex rounded-xl ${feature.iconBg} p-3.5 shadow-sm`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="relative font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="relative mt-3 font-body text-sm leading-relaxed text-muted-foreground flex-grow">
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
