import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend 
} from "recharts";
import { Info, Map, Droplets, Thermometer, CloudRain, AlertTriangle, TrendingUp, AlertCircle, Calendar, Sprout } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import LoggedOutCTA from "@/components/ui/LoggedOutCTA";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockCropData, soilTypes, seasons } from "@/data/cropRiskData";
import { IndiaHeatmap } from "@/components/ui/IndiaHeatmap";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CropRisk = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedSoil, setSelectedSoil] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [targetState, setTargetState] = useState<string>("");
  
  const crop = selectedCrop ? mockCropData[selectedCrop] : null;

  const allSelected = selectedCrop && selectedSoil && selectedSeason && targetState;

  // Helper styles based on risk
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "High": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Low": return { color: "#16a34a", bg: "bg-green-50" };
      case "Medium": return { color: "#d97706", bg: "bg-amber-50" };
      case "High": return { color: "#dc2626", bg: "bg-red-50" };
      default: return { color: "#64748b", bg: "bg-slate-50" };
    }
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const getMonthStatus = (m: string) => {
    if (selectedCrop === "wheat") {
      if (["Nov", "Dec"].includes(m)) return "bg-green-100 border-green-400 text-green-800";
      if (["Mar", "Apr"].includes(m)) return "bg-amber-100 border-amber-400 text-amber-800";
      if (["Jan", "Feb"].includes(m)) return "bg-emerald-50 border-emerald-200 text-emerald-800";
      return "bg-slate-50 text-slate-400 border-slate-200";
    }
    if (selectedCrop === "rice") {
      if (["Jun", "Jul"].includes(m)) return "bg-green-100 border-green-400 text-green-800";
      if (["Oct", "Nov"].includes(m)) return "bg-amber-100 border-amber-400 text-amber-800";
      if (["Aug", "Sep"].includes(m)) return "bg-emerald-50 border-emerald-200 text-emerald-800";
      return "bg-slate-50 text-slate-400 border-slate-200";
    }
    return "bg-slate-50 text-slate-400 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar alwaysOpaque={true} />
      
      <div className="flex flex-1 mt-[64px]">
        {/* Sticky Left Sidebar */}
        <aside className="w-[380px] hidden lg:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] bg-white border-r border-border shadow-sm z-30 overflow-y-auto shrink-0 transition-all">
          
          {/* STEP 1: Crop Selector */}
          <div className="px-6 py-6 border-b border-border bg-slate-50/50">
            <h2 className="font-display font-semibold text-lg mb-4 text-foreground">Select Crop</h2>
            <div>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Choose a crop..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(mockCropData).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* STEP 2: Crop Profile Section */}
          {crop && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-6 py-6 border-b border-border"
            >
              <h2 className="font-display font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-600" />
                {crop.name} Profile
              </h2>
              
              <div className="space-y-3 font-body text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <Droplets className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Water Requirement</p>
                    <p className="text-muted-foreground">{crop.waterRequirement}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <Thermometer className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Temp Range</p>
                    <p className="text-muted-foreground">{crop.tempRange}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <CloudRain className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Weather Focus</p>
                    <p className="text-muted-foreground">Rain: {crop.rainfall} | Hum: {crop.humidity}</p>
                    <p className="text-muted-foreground text-xs mt-1">Frost: {crop.frostSensitivity}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Risk Assessment Section */}
          {crop && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-6 py-6 border-b border-border bg-slate-50/50"
            >
              <h2 className="font-display font-semibold text-lg mb-4 text-foreground">Assess the risk for your area</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Season</label>
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">State</label>
                  <Select value={targetState} onValueChange={setTargetState}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Soil Type</label>
                  <Select value={selectedSoil} onValueChange={setSelectedSoil}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Soil Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Risk Output */}
          {allSelected && crop && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-6 flex-1 bg-white"
            >
              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Calculated Risk Level</p>
                <Badge className={`px-3 py-1.5 text-sm font-bold border uppercase ${getRiskColor(crop.riskLevel)}`} variant="outline">
                  {crop.riskLevel} Risk
                </Badge>
              </div>
              
              <div className="p-4 rounded-lg border border-indigo-100 bg-indigo-50/50">
                <p className="text-sm text-indigo-900 leading-relaxed font-body">
                  <span className="font-semibold block mb-1">AI Assessed Reasoning:</span>
                  {crop.riskExplanation}
                </p>
              </div>
            </motion.div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative">
          {!allSelected ? (
            <div className="flex items-center justify-center h-full min-h-[calc(100vh-64px)] text-center p-8">
              <div>
                <Map className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-semibold text-slate-700 mb-2">Configure Risk Profile</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Please select a crop, season, state, and soil type from the sidebar to generate the comprehensive geospatial risk dashboard.</p>
              </div>
            </div>
          ) : (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 min-h-[calc(100vh-64px)] pb-16">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="font-display font-bold text-3xl">Risk & Analytics Dashboard : {crop.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Top 5 Suitable States */}
              <Card className="p-5 shadow-sm lg:col-span-1">
                <h3 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  Suitability by State
                </h3>
                <div className="space-y-4">
                  {crop.topStates.map((ts, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{ts.state}</span>
                        <span className="text-muted-foreground">{ts.score}%</span>
                      </div>
                      <Progress value={ts.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Heatmap */}
              <Card className="p-5 shadow-sm lg:col-span-2 flex flex-col">
                <h3 className="font-display font-semibold text-lg mb-4">Geospatial Risk Heatmap</h3>
                <div className="flex-1 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center min-h-[250px] relative overflow-hidden group">
                  <IndiaHeatmap 
                    targetState={targetState} 
                    selectedSoil={selectedSoil} 
                    cropRiskLevel={crop.riskLevel} 
                  />
                </div>
              </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Yield Prediction */}
              <Card className="p-5 shadow-sm">
                <h3 className="font-display font-semibold text-lg mb-4">Historical Yield Trends (tons/ha)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crop.historicalYield} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="actual" name="Actual Yield" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                      <Area type="monotone" strokeDasharray="5 5" dataKey="predicted" name="AI Predicted" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorPred)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Price Trends */}
              <Card className="p-5 shadow-sm">
                <h3 className="font-display font-semibold text-lg mb-4">Market Price vs MSP (₹/Qtl)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crop.priceTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                      <RechartsTooltip />
                      <Legend iconType="plainline" wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="marketPrice" name="Market Price" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="stepAfter" dataKey="msp" name="MSP Target" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Sowing Calendar */}
              <Card className="p-5 shadow-sm lg:col-span-1">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Crop Calendar
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {months.map(m => (
                    <div key={m} className={`text-center py-2 px-1 text-[11px] font-bold uppercase rounded border ${getMonthStatus(m)}`}>
                      {m}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4 text-[10px] uppercase font-semibold text-muted-foreground justify-center">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-200"></div> Sowing</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-200"></div> Harvest</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-100"></div> Growth</span>
                </div>
              </Card>
              
              {/* Pest Alerts */}
              <div className="lg:col-span-1">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Active Alerts
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {crop.pestAlerts.map(alert => {
                    const style = getSeverityStyle(alert.severity);
                    return (
                      <Card key={alert.id} className={`p-4 border-l-4 ${style.bg}`} style={{ borderLeftColor: style.color }}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-foreground">{alert.name}</h4>
                          <Badge variant="outline" className="text-[10px] uppercase py-0" style={{ color: style.color, borderColor: style.color }}>
                            {alert.severity} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 flex gap-2 items-start mt-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: style.color }} />
                          <span><strong>Action:</strong> {alert.prevention}</span>
                        </p>
                      </Card>
                    )
                  })}
                </div>
              </div>

            </div>
            
            </div>
          )}
        </main>
      </div>

      <LoggedOutCTA />
      <Footer />
    </div>
  );
};

export default CropRisk;
