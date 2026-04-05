import ScrollReveal from "./ScrollReveal";
import { Sprout, BarChart3, Shield, Map, CloudSun, Truck, TrendingUp, Leaf } from "lucide-react";

const features = [
  {
    icon: Sprout,
    title: "Precision Farming",
    description: "AI-powered crop monitoring delivers real-time insights for optimal growth conditions.",
    gradient: "from-emerald-50 to-green-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200/60",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Yield",
    description: "Predictive analytics help forecast harvests and plan resource allocation effectively.",
    gradient: "from-sky-50 to-blue-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    borderColor: "border-sky-200/60",
  },
  {
    icon: Shield,
    title: "Sustainable Practices",
    description: "Reduce water and fertilizer usage while maximizing output and protecting soil health.",
    gradient: "from-lime-50 to-emerald-50",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-600",
    borderColor: "border-lime-200/60",
  },
  {
    icon: Map,
    title: "Supply Chain Map",
    description: "Interactive visual map showing where crops are grown, transportation routes, and market destinations in real time.",
    gradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200/60",
  },
  {
    icon: CloudSun,
    title: "Climate Impact Insights",
    description: "Monitor climate patterns and assess environmental impact to adapt farming strategies proactively.",
    gradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200/60",
  },
  {
    icon: Truck,
    title: "Route Optimization",
    description: "Smart logistics reduce post-harvest losses with optimized transportation from farm to market.",
    gradient: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    borderColor: "border-teal-200/60",
  },
];

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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div
                className={`group relative overflow-hidden rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.gradient} p-7 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/40 hover:-translate-y-1`}
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
                <div className={`relative mb-5 inline-flex rounded-xl ${feature.iconBg} p-3.5 shadow-sm`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="relative font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="relative mt-3 font-body text-sm leading-relaxed text-muted-foreground">
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
