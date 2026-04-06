import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface Props {
  targetState: string;
  selectedSoil: string;
  cropRiskLevel: string;
}

const soilDistrictData: Record<string, Record<string, string[]>> = {
  karnataka: {
    loamy: ["Dharwad", "Haveri", "Gadag", "Belagavi"],
    black: ["Bijapur", "Gulbarga", "Raichur"],
    red: ["Bellary", "Chitradurga", "Kolar"],
    laterite: ["Mangalore", "Udupi", "Shimoga"]
  },
  punjab: {
    loamy: ["Ludhiana", "Amritsar", "Jalandhar"],
    alluvial: ["Firozpur", "Faridkot", "Bathinda"]
  },
  maharashtra: {
    black: ["Nagpur", "Wardha", "Solapur"],
    alluvial: ["Nashik", "Pune", "Kolhapur"]
  }
};

const districtCoordinates: Record<string, { x: number, y: number, state: string }> = {
  // Karnataka (~ South West of 100x100 blob)
  "Dharwad": { x: 38, y: 70, state: "Karnataka" },
  "Haveri": { x: 37, y: 73, state: "Karnataka" },
  "Gadag": { x: 41, y: 71, state: "Karnataka" },
  "Belagavi": { x: 35, y: 67, state: "Karnataka" },
  "Bijapur": { x: 40, y: 64, state: "Karnataka" },
  "Gulbarga": { x: 45, y: 63, state: "Karnataka" },
  "Raichur": { x: 47, y: 67, state: "Karnataka" },
  "Bellary": { x: 44, y: 70, state: "Karnataka" },
  "Chitradurga": { x: 42, y: 74, state: "Karnataka" },
  "Kolar": { x: 48, y: 78, state: "Karnataka" },
  "Mangalore": { x: 33, y: 75, state: "Karnataka" },
  "Udupi": { x: 31, y: 73, state: "Karnataka" },
  "Shimoga": { x: 38, y: 76, state: "Karnataka" },
  
  // Punjab (~ North West)
  "Ludhiana": { x: 38, y: 20, state: "Punjab" },
  "Amritsar": { x: 35, y: 17, state: "Punjab" },
  "Jalandhar": { x: 36, y: 19, state: "Punjab" },
  "Firozpur": { x: 32, y: 20, state: "Punjab" },
  "Faridkot": { x: 33, y: 22, state: "Punjab" },
  "Bathinda": { x: 35, y: 24, state: "Punjab" },
  
  // Maharashtra (~ West Center)
  "Nagpur": { x: 55, y: 50, state: "Maharashtra" },
  "Wardha": { x: 52, y: 51, state: "Maharashtra" },
  "Solapur": { x: 42, y: 58, state: "Maharashtra" },
  "Nashik": { x: 35, y: 52, state: "Maharashtra" },
  "Pune": { x: 34, y: 56, state: "Maharashtra" },
  "Kolhapur": { x: 33, y: 61, state: "Maharashtra" }
};

const BaseHeatmap = ({ targetState, selectedSoil, cropRiskLevel }: Props) => {
  const formattedState = targetState.toLowerCase();
  const formattedSoil = selectedSoil.toLowerCase().replace(" soil", "");
  
  // Extract which districts have the selected soil in the target state
  const matchingDistricts = useMemo(() => {
    return soilDistrictData[formattedState]?.[formattedSoil] || [];
  }, [formattedState, formattedSoil]);

  // Determine standard color palette based on soil type
  const getSoilColor = () => {
    if (formattedSoil.includes('loamy')) return 'bg-teal-500 shadow-teal-500/50 border border-white';
    if (formattedSoil.includes('black')) return 'bg-slate-700 shadow-slate-700/50 border border-white';
    if (formattedSoil.includes('red')) return 'bg-red-500 shadow-red-500/50 border border-white';
    if (formattedSoil.includes('laterite')) return 'bg-orange-600 shadow-orange-600/50 border border-white';
    if (formattedSoil.includes('alluvial')) return 'bg-sky-400 shadow-sky-400/50 border border-white';
    if (formattedSoil.includes('sandy')) return 'bg-amber-300 shadow-amber-300/50 border border-white';
    return 'bg-green-500 shadow-green-500/50 border border-white';
  };

  const getRiskTextColor = () => {
    if (cropRiskLevel === 'High') return 'text-red-700 bg-red-50 border-red-200';
    if (cropRiskLevel === 'Medium') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  return (
    <div className="w-full h-[400px] flex flex-col relative bg-slate-50 overflow-hidden items-center justify-center p-4">
      
      {/* Visual Header / Indicator Hub */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <Badge variant="outline" className={`px-2 py-1 font-semibold border shadow-sm ${getRiskTextColor()}`}>
          {targetState} — {selectedSoil}
        </Badge>
        {matchingDistricts.length > 0 ? (
          <span className="text-xs font-semibold text-slate-500 bg-white/80 px-2 py-1 rounded shadow-sm">
            {matchingDistricts.length} Districts Found
          </span>
        ) : (
          <span className="text-xs font-semibold text-slate-400 bg-white/80 px-2 py-1 rounded shadow-sm">
            No exact matches configured
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 p-2 rounded-lg border shadow-sm text-xs text-slate-600 font-medium">
        <div className={`w-3 h-3 rounded-full ${getSoilColor()} shadow-sm`}></div>
        <span>Soil Presence Indicator</span>
      </div>

      <div className="relative w-full max-w-[300px] h-full flex items-center justify-center">
        {/* Abstract Stylized SVG backdrop of India */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 drop-shadow-md" fill="currentColor">
          <path d="M40 5 L50 15 L60 20 L65 15 L75 20 L85 35 L75 45 L95 45 L90 55 L80 55 L75 65 L60 75 L55 95 L50 90 L40 85 L30 75 L25 60 L15 50 L10 40 L20 25 L30 30 Z" />
          
          {/* Subtle grid mesh overlays just to give it a techy Dashboard vibe */}
          <path d="M50 5 L50 95 M20 40 L80 40 M30 75 L70 75 M40 20 L75 20" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.3"/>
        </svg>

        {/* Loop through explicitly mapped district coordinates and plot absolute pins */}
        {Object.entries(districtCoordinates).map(([district, coords]) => {
          // If the district belongs to the target state, show it
          if (coords.state.toLowerCase() === formattedState) {
            
            const isMatch = matchingDistricts.includes(district);
            
            // Un-matched pins stay small grey dots
            if (!isMatch) {
              return (
                <div 
                  key={district}
                  className="absolute w-1.5 h-1.5 rounded-full bg-slate-400/50 transition-all pointer-events-none"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%`, marginLeft: '-3px', marginTop: '-3px' }}
                ></div>
              );
            }

            // Matched pins pulse and grow with the Soil specific color
            return (
              <div 
                key={district}
                className="absolute flex items-center justify-center group z-10 cursor-pointer"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              >
                <div className={`absolute w-3 h-3 rounded-full ${getSoilColor()} animate-pulse opacity-75`}></div>
                <div className={`w-2.5 h-2.5 rounded-full ${getSoilColor()} z-10 shadow-lg`}></div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center gap-0.5">
                  <div className="font-bold flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {district}
                  </div>
                  <div className="text-[9px] text-slate-300 opacity-80">{selectedSoil}</div>
                </div>
              </div>
            );
          }
          return null; 
        })}
      </div>

    </div>
  );
};

export const IndiaHeatmap = React.memo(BaseHeatmap);
