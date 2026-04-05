import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Sparkles, AlertTriangle, Cloud, Newspaper, ShieldCheck,
  Droplets, Sprout, Shield, CalendarDays, Sun, Leaf, ChevronDown,
  TrendingUp, Thermometer, Zap, ArrowLeft, Menu, X, Wind
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import CropSenseLogo from "@/components/landing/CropSenseLogo";
import Footer from "@/components/landing/Footer";
import {
  locationData, getInsightsForDistrict, getCropRisk, getClimateData,
  getRecommendations, cropList,
  type NewsItem, type CropRisk, type ClimateDataPoint, type Recommendation,
} from "@/data/exploreData";
import { generateLiveAIAgentOverview, type AILiveOverview } from "@/services/aiAgent";
import Navbar from "@/components/landing/Navbar";

/* ───────────────────── Severity helpers ───────────────────── */
const severityConfig = {
  critical: { color: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle },
  warning: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertTriangle },
  info: { color: "bg-sky-100 text-sky-700 border-sky-200", icon: Newspaper },
};

const categoryIcons = {
  crop_failure: Sprout,
  weather: Cloud,
  market: TrendingUp,
  policy: ShieldCheck,
};

const categoryLabels = {
  crop_failure: "Crop Alert",
  weather: "Weather",
  market: "Market",
  policy: "Policy",
};

const riskConfig = {
  Low: { color: "bg-emerald-100 text-emerald-700 border-emerald-300", bar: "bg-emerald-500" },
  Medium: { color: "bg-amber-100 text-amber-700 border-amber-300", bar: "bg-amber-500" },
  High: { color: "bg-red-100 text-red-700 border-red-300", bar: "bg-red-500" },
};

const priorityConfig = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-emerald-500",
};

const recIcons = {
  water: Droplets,
  seed: Sprout,
  shield: Shield,
  calendar: CalendarDays,
  sun: Sun,
  leaf: Leaf,
};

/* ───────────────────── Animation variants ───────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const ExplorePage = () => {
  // ── Location state
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // ── AI Agent State
  const [liveOverview, setLiveOverview] = useState<AILiveOverview | null>(null);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [agentError, setAgentError] = useState("");

  // ── Crop risk state
  const [selectedCrop, setSelectedCrop] = useState<string>("");

  const stateObj = locationData.find((s) => s.name === selectedState);

  const locationSelected = selectedState && selectedDistrict;

  useEffect(() => {
    if (!selectedState || !selectedDistrict) {
      setLiveOverview(null);
      return;
    }
    
    let isMounted = true;
    const runAgent = async () => {
      setIsLoadingAgent(true);
      setAgentError("");
      try {
        const data = await generateLiveAIAgentOverview(selectedState, selectedDistrict);
        if (isMounted) setLiveOverview(data);
      } catch (err) {
        if (isMounted) setAgentError(err instanceof Error ? err.message : "Failed to load agent");
      } finally {
        if (isMounted) setIsLoadingAgent(false);
      }
    };
    
    runAgent();
    return () => { isMounted = false; };
  }, [selectedState, selectedDistrict]);

  const insights = useMemo(
    () => (locationSelected ? getInsightsForDistrict(selectedState, selectedDistrict) : null),
    [selectedState, selectedDistrict, locationSelected]
  );

  const cropRisk = useMemo(
    () => (selectedCrop && locationSelected ? getCropRisk(selectedCrop, selectedDistrict) : null),
    [selectedCrop, selectedDistrict, locationSelected]
  );

  const climateData = useMemo(
    () => (locationSelected ? getClimateData(selectedDistrict) : null),
    [selectedDistrict, locationSelected]
  );

  const recommendations = useMemo(
    () => (locationSelected ? getRecommendations(selectedDistrict) : null),
    [selectedDistrict, locationSelected]
  );

  // ── Reset dependent selections
  const handleStateChange = (val: string) => {
    setSelectedState(val);
    setSelectedDistrict("");
    setSelectedCrop("");
  };

  const handleDistrictChange = (val: string) => {
    setSelectedDistrict(val);
    setSelectedCrop("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar alwaysOpaque={true} />

      <main className="flex-1 mt-16 md:mt-20">
        {/* ── Hero header ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-16 md:py-20">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-100/40 blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-4">
                <MapPin className="h-3.5 w-3.5" />
                Location Intelligence
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Explore Your <span className="text-gradient-primary">City</span>
              </h1>
              <p className="mt-4 font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Select your location to unlock AI-powered agricultural insights, crop risk analysis, and climate trends for your region.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Location selectors ── */}
        <section className="py-10 md:py-14 border-b border-border/50">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Select Your Location</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  {/* State */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">State</label>
                    <Select value={selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger className="bg-white h-12 rounded-xl border-border/60 shadow-sm font-body">
                        <SelectValue placeholder="Choose state" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationData.map((s) => (
                          <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">District</label>
                    <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState}>
                      <SelectTrigger className="bg-white h-12 rounded-xl border-border/60 shadow-sm font-body">
                        <SelectValue placeholder="Choose district" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateObj?.districts.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Conditional content after location is selected ── */}
        <AnimatePresence mode="wait">
          {locationSelected && insights && climateData && recommendations && (
            <motion.div
              key={`${selectedState}-${selectedDistrict}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* ───── Live AI Agent Section ───── */}
              <section className="py-12 md:py-16 bg-gradient-to-b from-white to-emerald-50/30">
                <div className="container mx-auto px-6">
                  <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Live AI Agent Insights — {selectedState}, {selectedDistrict}
                    </h2>
                  </div>

                  {isLoadingAgent ? (
                    <motion.div {...fadeUp}>
                      <Card className="mb-8 border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white overflow-hidden shadow-sm">
                        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[200px]">
                          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
                          <p className="font-body text-emerald-800 font-medium animate-pulse">Agent is fetching real-time climate and scraping news data for {selectedState}...</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : agentError ? (
                    <motion.div {...fadeUp}>
                      <Card className="mb-8 border-red-200 bg-red-50">
                        <CardContent className="p-6">
                          <p className="text-red-600 font-medium">{agentError}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : liveOverview ? (
                    <>
                      {/* District Meteorological Dashboard */}
                      <div className="mb-6">
                        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-emerald-600" />
                          District Real-Time Weather — {selectedDistrict}
                        </h3>
                      </div>
                      <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-8">
                        {/* Current & Daily Temp */}
                        <motion.div variants={fadeUp}>
                          <Card className="h-full border border-sky-100 bg-gradient-to-br from-white to-sky-50 shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-body text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Temperature</p>
                                <h4 className="font-display text-2xl font-bold text-foreground">
                                  {liveOverview.districtWeather.currentTemp.toFixed(1)}°C
                                </h4>
                                <p className="font-body text-xs text-muted-foreground mt-1">
                                  Min: {liveOverview.districtWeather.minTemp}°C / Max: {liveOverview.districtWeather.maxTemp}°C
                                </p>
                              </div>
                              <Thermometer className="h-8 w-8 text-sky-400 opacity-80" />
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Wind Speed */}
                        <motion.div variants={fadeUp}>
                          <Card className="h-full border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-body text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Wind Speed</p>
                                <h4 className="font-display text-2xl font-bold text-foreground">
                                  {liveOverview.districtWeather.windSpeed} km/h
                                </h4>
                                <p className="font-body text-xs text-muted-foreground mt-1">Status: Surface Flow</p>
                              </div>
                              <Wind className="h-8 w-8 text-emerald-400 opacity-80" />
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* UV Index */}
                        <motion.div variants={fadeUp}>
                          <Card className="h-full border border-orange-100 bg-gradient-to-br from-white to-orange-50 shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-body text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Max UV Index</p>
                                <h4 className="font-display text-2xl font-bold text-foreground">
                                  {liveOverview.districtWeather.uvIndex}
                                </h4>
                                <p className="font-body text-xs text-muted-foreground mt-1">
                                  {liveOverview.districtWeather.uvIndex >= 8 ? "Very High Risk" : liveOverview.districtWeather.uvIndex >= 6 ? "High Risk" : "Moderate Risk"}
                                </p>
                              </div>
                              <Sun className="h-8 w-8 text-orange-400 opacity-80" />
                            </CardContent>
                          </Card>
                        </motion.div>
                        
                        {/* Status Label */}
                        <motion.div variants={fadeUp}>
                          <Card className="h-full border border-teal-100 bg-gradient-to-br from-white to-teal-50 shadow-sm flex items-center justify-center p-4 text-center">
                            <div>
                               <Zap className="h-6 w-6 text-teal-600 mb-2 mx-auto" />
                               <span className="font-body font-semibold text-teal-800 text-sm">Real-Time Open-Meteo Synced</span>
                            </div>
                          </Card>
                        </motion.div>
                      </motion.div>

                      {/* AI Summary */}
                      <div className="mb-4">
                        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-emerald-600" />
                          Synthesized State Overview
                        </h3>
                      </div>
                      <motion.div {...fadeUp}>
                        <Card className="mb-8 border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white overflow-hidden shadow-sm">
                          <CardContent className="p-6 md:p-8">
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 rounded-xl bg-emerald-100 p-3 shadow-inner">
                                <Sparkles className="h-6 w-6 text-emerald-700" />
                              </div>
                              <div>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Real-Time Climate Analysis</h3>
                                <p className="font-body text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                  {liveOverview.climateOverview}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Trending Headlines */}
                      <div className="mb-4">
                        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                          <Newspaper className="h-5 w-5 text-emerald-600" />
                          Trending Crop & Weather News
                        </h3>
                      </div>
                      <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2">
                        {liveOverview.trendingHeadlines.map((news, i) => (
                          <motion.div key={i} variants={fadeUp}>
                            <Card className="h-full border border-sky-200 hover:shadow-md hover:border-emerald-300 transition-all group overflow-hidden bg-white">
                              <CardContent className="p-5 flex flex-col h-full bg-gradient-to-br from-white to-sky-50/20">
                                <div className="flex items-start gap-3 flex-1 mb-4">
                                  <div>
                                    <Badge variant="outline" className="mb-2 bg-sky-50 text-sky-700 border-sky-200 font-body text-[10px] uppercase font-bold tracking-wider">
                                      {news.source || "News Update"}
                                    </Badge>
                                    <h4 className="font-display text-base font-semibold text-foreground leading-snug group-hover:text-emerald-700 transition-colors">
                                      {news.title}
                                    </h4>
                                  </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-border/50">
                                  <a href={news.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors inline-flex items-center gap-1 group-hover:underline">
                                    Read Full Article <span className="text-[10px]">↗</span>
                                  </a>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  ) : null}
                </div>
              </section>

              {/* ───── Crop Risk Checker ───── */}
              <section className="py-12 md:py-16 bg-white border-t border-border/30">
                <div className="container mx-auto px-6">
                  <div className="flex items-center gap-2 mb-8">
                    <Shield className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Crop Risk Checker
                    </h2>
                  </div>

                  <div className="max-w-2xl">
                    <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Select a crop
                    </label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger className="bg-white h-12 rounded-xl border-border/60 shadow-sm font-body max-w-sm">
                        <SelectValue placeholder="Choose crop to analyze" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropList.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <AnimatePresence mode="wait">
                    {cropRisk && (
                      <motion.div {...fadeUp} key={cropRisk.crop} className="mt-6">
                        <Card className={`max-w-2xl border-2 ${riskConfig[cropRisk.risk].color.split(" ").find((c) => c.startsWith("border-"))}`}>
                          <CardContent className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-display text-xl font-bold text-foreground">{cropRisk.crop}</h3>
                              <Badge className={`${riskConfig[cropRisk.risk].color} font-body text-sm px-4 py-1`}>
                                {cropRisk.risk} Risk
                              </Badge>
                            </div>
                            {/* Risk bar */}
                            <div className="w-full h-2.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${riskConfig[cropRisk.risk].bar}`}
                                style={{
                                  width: cropRisk.risk === "Low" ? "25%" : cropRisk.risk === "Medium" ? "55%" : "90%",
                                }}
                              />
                            </div>
                            <p className="font-body text-sm leading-relaxed text-muted-foreground">
                              {cropRisk.explanation}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* ───── Climate Data Section ───── */}
              <section className="py-12 md:py-16 bg-gradient-to-b from-sky-50/40 to-white border-t border-border/30">
                <div className="container mx-auto px-6">
                  <div className="flex items-center gap-2 mb-8">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Climate Data — {selectedDistrict}
                    </h2>
                  </div>

                  <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-6 lg:grid-cols-3">
                    {/* Rainfall */}
                    <motion.div variants={fadeUp}>
                      <Card className="border-sky-200/60 h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-display">
                            <Droplets className="h-4 w-4 text-sky-600" />
                            Rainfall Trends (mm)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={climateData}>
                              <defs>
                                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                              <Tooltip
                                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                              />
                              <Area type="monotone" dataKey="rainfall" stroke="#0ea5e9" fill="url(#rainGrad)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Temperature */}
                    <motion.div variants={fadeUp}>
                      <Card className="border-orange-200/60 h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-display">
                            <Thermometer className="h-4 w-4 text-orange-500" />
                            Temperature Trends (°C)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={climateData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} domain={[15, 40]} />
                              <Tooltip
                                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                              />
                              <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: "#f97316" }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* UV */}
                    <motion.div variants={fadeUp}>
                      <Card className="border-violet-200/60 h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-display">
                            <Zap className="h-4 w-4 text-violet-600" />
                            UV Index
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={climateData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} domain={[0, 12]} />
                              <Tooltip
                                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                              />
                              <Bar dataKey="uvIndex" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* ───── Recommendations Section ───── */}
              <section className="py-12 md:py-16 bg-white border-t border-border/30">
                <div className="container mx-auto px-6">
                  <div className="flex items-center gap-2 mb-8">
                    <Leaf className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Recommended Actions
                    </h2>
                  </div>

                  <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((rec, i) => {
                      const RecIcon = recIcons[rec.icon];
                      return (
                        <motion.div key={i} variants={fadeUp}>
                          <Card className={`h-full border-l-4 ${priorityConfig[rec.priority]} hover:shadow-lg transition-shadow`}>
                            <CardContent className="p-5">
                              <div className="flex items-start gap-3">
                                <div className="shrink-0 rounded-lg bg-emerald-50 p-2.5">
                                  <RecIcon className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-display text-base font-semibold text-foreground leading-snug">{rec.title}</h4>
                                    <Badge variant="outline" className={`font-body text-[10px] px-2 py-0.5 ${
                                      rec.priority === "high"
                                        ? "bg-red-50 text-red-600 border-red-200"
                                        : rec.priority === "medium"
                                        ? "bg-amber-50 text-amber-600 border-amber-200"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    }`}>
                                      {rec.priority}
                                    </Badge>
                                  </div>
                                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!locationSelected && (
          <motion.div {...fadeUp} className="py-24 text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <MapPin className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Select a location to begin</h3>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              Choose your State and District above to unlock AI-powered agricultural insights for your region.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExplorePage;
