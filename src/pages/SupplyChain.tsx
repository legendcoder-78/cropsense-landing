import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ShieldAlert, Truck, AlertTriangle, ArrowRight, Activity, Globe
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { locationData } from "@/data/exploreData";
import { calculateDetailedRisk } from "@/utils/sclllmtest";

/* ───────────────────── Animation variants ───────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const SupplyChain = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [tempScore, setTempScore] = useState<number>(5.0);
  const [rainScore, setRainScore] = useState<number>(5.0);
  const [cropScore, setCropScore] = useState<number>(5.0);

  // Derive risk result based on state + inputs
  const riskResult = useMemo(() => {
    if (!selectedState) return null;
    return calculateDetailedRisk(selectedState, tempScore, rainScore, cropScore);
  }, [selectedState, tempScore, rainScore, cropScore]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar alwaysOpaque={true} />

      <main className="flex-1 mt-16 md:mt-20">
        {/* ── Hero header ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-red-50 py-16 md:py-20">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-4">
                <Truck className="h-3.5 w-3.5" />
                Logistics Intelligence
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight shadow-sm">
                Supply Chain <span className="text-gradient-primary">Risk Module</span>
              </h1>
              <p className="mt-4 font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Predict supply disruptions based on state-level infrastructure, climate conditions, and crop scores.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Dashboard Configurator ── */}
        <section className="py-10 md:py-14 border-b border-border/50">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Disruption Predictor Simulator</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-border/60 shadow-sm">
                  {/* State Select */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Region (State)</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="bg-slate-50 h-10 rounded-lg border-border/60 shadow-sm font-body focus:ring-amber-500">
                        <SelectValue placeholder="Choose state" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationData.map((s) => (
                          <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temp Score */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
                      <span>Temperature Stress</span>
                      <span className="text-amber-600 font-bold">{tempScore.toFixed(1)}</span>
                    </label>
                    <input type="range" min="0" max="10" step="0.1" value={tempScore} onChange={(e) => setTempScore(parseFloat(e.target.value))} className="w-full accent-amber-500" />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>0 (Ideal)</span><span>10 (Severe)</span></div>
                  </div>

                  {/* Rain Score */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
                      <span>Rainfall Anomaly</span>
                      <span className="text-blue-600 font-bold">{rainScore.toFixed(1)}</span>
                    </label>
                    <input type="range" min="0" max="10" step="0.1" value={rainScore} onChange={(e) => setRainScore(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>0 (Normal)</span><span>10 (Flood/Drought)</span></div>
                  </div>

                  {/* Crop Score */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
                      <span>Crop Yield Deficit</span>
                      <span className="text-emerald-600 font-bold">{cropScore.toFixed(1)}</span>
                    </label>
                    <input type="range" min="0" max="10" step="0.1" value={cropScore} onChange={(e) => setCropScore(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>0 (Surplus)</span><span>10 (Failure)</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Engine Output ── */}
        <AnimatePresence mode="wait">
          {selectedState && riskResult && (
            <motion.div
              key={selectedState}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50"
            >
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 rounded-2xl overflow-hidden shadow-lg transition-colors duration-500" style={{ borderColor: riskResult.severityColor }}>
                    {/* Header Area */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-b border-border/40">
                      <div>
                        <Badge variant="outline" className="mb-3 px-3 py-1 font-body text-xs uppercase tracking-widest font-bold" style={{ color: riskResult.severityColor, borderColor: riskResult.severityColor, backgroundColor: `${riskResult.severityColor}15` }}>
                          Target Region: {riskResult.state}
                        </Badge>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                          {riskResult.status}
                        </h1>
                      </div>
                      <div className="text-center md:text-right">
                        <div className="font-body text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                          AI Weighted Risk Score
                        </div>
                        <div className="font-display text-5xl md:text-6xl font-black tabular-nums" style={{ color: riskResult.severityColor }}>
                          {riskResult.riskScore}
                        </div>
                        <p className="font-body text-xs text-muted-foreground mt-1 text-right">Data Method: {riskResult.dataMethod}</p>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="p-6 md:p-8 bg-slate-50/50 flex items-start gap-4">
                      <div className="shrink-0 rounded-xl p-4 shadow-sm bg-white" style={{ border: `1px solid ${riskResult.severityColor}50` }}>
                        <ShieldAlert className="h-8 w-8" style={{ color: riskResult.severityColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                          Logistics Commander Directive
                        </h3>
                        <p className="font-body text-base md:text-lg leading-relaxed font-medium" style={{ color: riskResult.severityColor === '#388e3c' ? '#166534' : riskResult.severityColor }}>
                          {riskResult.suggestedAction}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!selectedState && (
          <motion.div {...fadeUp} className="py-24 text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
              <Activity className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Initialize Predictor Module</h3>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              Select a state to evaluate supply chain volatility using real-time AI weighted climate and crop deficit parameters.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SupplyChain;
