import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nexusOracle, AGRI_DATA } from '../config/sclllmtest';
import { Loader2, Network, AlertTriangle, CheckCircle2, ShieldCheck, Cpu, ArrowRight, Search } from "lucide-react";

const NexusCommandCenter = () => {
    const navigate = useNavigate();
    const [persona, setPersona] = useState('NGO');
    const [query, setQuery] = useState('');
    const [oracleResult, setOracleResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOracleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setOracleResult(null);

        try {
            const result = await nexusOracle.runFullAnalysis(query, persona);
            setOracleResult(result);
        } catch (err) {
            setOracleResult({ error: "Intelligence Layer connection error." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-200 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Expert System</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Network className="h-8 w-8 text-emerald-600" /> Supply Chain Intelligence
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm italic">Prescriptive Logistics & Crop Failure Mitigation</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-[11px] font-bold text-slate-400 ml-2 uppercase">Persona:</span>
                        <select
                            className="bg-slate-50 border-none rounded-lg p-2 text-slate-700 font-bold text-sm outline-none"
                            value={persona}
                            onChange={(e) => setPersona(e.target.value)}
                        >
                            <option value="NGO">NGO Representative</option>
                            <option value="GOVERNMENT">Government Official</option>
                            <option value="RETAILER">Commercial Retailer</option>
                        </select>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT: INPUT & GRID */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                                <Cpu className="h-5 w-5 text-emerald-600" /> Intelligence Analyst
                            </h2>
                            <form onSubmit={handleOracleQuery} className="space-y-4">
                                <div className="relative">
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none h-36 transition-all placeholder:text-slate-400"
                                        placeholder="E.g., 'What if there is a severe flood in Karnataka in August?'"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Search className="absolute bottom-3 right-3 h-4 w-4 text-slate-300" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-3 shadow-md">
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate Simulation Report"}
                                </button>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">National Grid Status</h3>
                            <div className="space-y-1 max-h-[350px] overflow-y-auto pr-2">
                                {Object.keys(AGRI_DATA).map(state => (
                                    <div key={state} className="p-3 rounded-xl hover:bg-slate-50 flex justify-between items-center transition-all">
                                        <span className="text-sm font-semibold text-slate-700">{state}</span>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DETAILED RESULTS */}
                    <div className="lg:col-span-7">
                        {!oracleResult && !loading && (
                            <div className="h-full min-h-[450px] bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center italic">
                                <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
                                Awaiting Simulation Parameters...
                            </div>
                        )}

                        {oracleResult && !oracleResult.error && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500"></div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{oracleResult.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg italic bg-slate-50 p-5 rounded-xl border-l-4 border-slate-300">
                                        "{oracleResult.detailedImpact}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4 text-red-600"><AlertTriangle className="h-4 w-4" /><span className="text-xs font-bold uppercase">Impacted</span></div>
                                        <div className="flex flex-wrap gap-2">{oracleResult.impactedCrops?.map(c => <span key={c} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">{c}</span>)}</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4 text-emerald-600"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-bold uppercase">Safe</span></div>
                                        <div className="flex flex-wrap gap-2">{oracleResult.safeCrops?.map(c => <span key={c} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">{c}</span>)}</div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl">
                                    <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 mb-4">Strategic Directive</h4>
                                    <p className="text-lg leading-relaxed font-medium">{oracleResult.advice}</p>
                                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        <span>Bypass: {oracleResult.alternate}</span>
                                        <span>Verified Output</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-20 text-center border-t border-slate-200 pt-10 pb-20">
                    <button onClick={() => navigate("/dashboard")} className="bg-white border px-10 py-4 rounded-full font-bold flex items-center gap-3 mx-auto shadow-sm hover:shadow-md active:scale-95 transition-all">
                        Continue to Dashboard <ArrowRight className="h-4 w-4 text-emerald-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NexusCommandCenter;