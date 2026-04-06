import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Activity, CheckCircle2, AlertTriangle, ExternalLink, Building2, Truck
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import LoggedOutCTA from "@/components/ui/LoggedOutCTA";
import stateCropMapping from "@/data/state_crop_mapping.json";
import { analyzeSupplyChain, type SupplyChainInsight } from "@/services/supplyChainAgent";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const SupplyChain = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [insightResult, setInsightResult] = useState<SupplyChainInsight | null>(null);

  const availableStates = Object.keys(stateCropMapping.states);
  // @ts-ignore - dynamic key indexing
  const availableCrops = selectedState ? (stateCropMapping.states[selectedState] || []) : [];

  // Reset crop when state changes
  useEffect(() => {
    setSelectedCrop("");
    setInsightResult(null);
  }, [selectedState]);

  // Trigger agent when both are selected
  useEffect(() => {
    if (!selectedState || !selectedCrop) {
      setInsightResult(null);
      return;
    }

    let isMounted = true;
    const runAnalysis = async () => {
      setIsAnalyzing(true);
      setInsightResult(null);
      try {
        const result = await analyzeSupplyChain(selectedState, selectedCrop);
        if (isMounted) setInsightResult(result);
      } catch (err) {
        console.error("Analysis Failed", err);
      } finally {
        if (isMounted) setIsAnalyzing(false);
      }
    };

    runAnalysis();

    return () => { isMounted = false; };
  }, [selectedState, selectedCrop]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar alwaysOpaque={true} />

      <main className="flex-1 mt-16 md:mt-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 md:py-20">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 mb-4">
                <Truck className="h-3.5 w-3.5" />
                Supply Chain Intelligence
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight shadow-sm">
                Supply Chain <span className="text-gradient-primary">Predictor</span>
              </h1>
              <p className="mt-4 font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Real-time AI disruption analysis using RAG over news and logistics platforms.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-10 md:py-14 border-b border-border/50">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Select Parameters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-border/60 shadow-sm">
                  {/* State Select */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Region (State)</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="bg-slate-50 h-12 rounded-lg border-border/60 shadow-sm font-body">
                        <SelectValue placeholder="Choose state" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStates.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Crop Select */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
                      <span>Crop</span>
                    </label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop} disabled={!selectedState}>
                      <SelectTrigger className="bg-slate-50 h-12 rounded-lg border-border/60 shadow-sm font-body">
                        <SelectValue placeholder={selectedState ? "Choose crop" : "Select state first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCrops.map((c: string) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <div className="max-w-md mx-auto flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
                <h3 className="font-display text-xl font-semibold mb-2">Analyzing RAG Sources...</h3>
                <p className="font-body text-sm text-muted-foreground">
                  The AI agent is aggregating news parameters for {selectedCrop} in {selectedState}. This might take a moment.
                </p>
              </div>
            </motion.div>
          )}

          {!isAnalyzing && insightResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="py-12 md:py-16 bg-slate-50"
            >
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* Primary Insight Card */}
                  <Card className={`border-2 rounded-2xl overflow-hidden shadow-lg transition-colors ${insightResult.status === "Stable" ? "border-emerald-500" : "border-red-500"}`}>
                    <div className="p-6 md:p-8 bg-white flex flex-col md:flex-row gap-6">
                      <div className="shrink-0">
                        <div className={`p-4 rounded-2xl ${insightResult.status === "Stable" ? "bg-emerald-50" : "bg-red-50"}`}>
                          {insightResult.status === "Stable" ? (
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="h-10 w-10 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className={`mb-3 px-3 py-1 font-body text-xs uppercase tracking-widest font-bold ${insightResult.status === "Stable" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200"}`}>
                          Supply Chain Status: {insightResult.status}
                        </Badge>
                        <p className="font-body text-lg leading-relaxed text-foreground">
                          {insightResult.explanation}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Secondary Providers Card (Only if Disrupted) */}
                  {insightResult.status === "Disrupted" && insightResult.providers && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        Alternative Provider Solutions
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        {insightResult.providers.map((provider, i) => (
                          <Card key={i} className="p-5 border border-indigo-100 hover:border-indigo-300 transition-colors shadow-sm bg-white flex flex-col h-full">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-display font-semibold text-lg">{provider.name}</h4>
                            </div>
                            <p className="font-body text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">
                              {provider.reason}
                            </p>
                            <a href={provider.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                              View Platform <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {!isAnalyzing && !insightResult && !selectedState && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <Activity className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Initialize RAG Platform</h3>
              <p className="font-body text-muted-foreground max-w-md mx-auto">
                Select your state and targeted crop to trigger our AI agents. The system will dynamically analyze real-time sources to verify supply chain stability.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <LoggedOutCTA />
      <Footer />
    </div>
  );
};

export default SupplyChain;
