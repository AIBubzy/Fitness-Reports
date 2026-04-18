import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ExternalLink, Download, Clock, User, ChevronRight, RefreshCw, Trash2 } from 'lucide-react'
import axios from 'axios'

export default function Dashboard() {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const fetchSubmissions = async () => {
        setLoading(true)
        try {
            const resp = await axios.get('/api/submissions')
            setSubmissions(resp.data)
        } catch (err) {
            console.error('Failed to fetch submissions', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredSubmissions = submissions.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getGoalColor = (goal) => {
        switch (goal) {
            case 'muscle_gain': return 'text-primary-blue bg-primary-blue/10 border-primary-blue/20'
            case 'weight_loss': return 'text-primary-pink bg-primary-pink/10 border-primary-pink/20'
            case 'performance': return 'text-primary-purple bg-primary-purple/10 border-primary-purple/20'
            default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold font-heading mb-2">Protocol <span className="text-primary-purple">Feed</span></h1>
                    <p className="text-white/50">Monitoring optimization logs from all active clients.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search biometric signatures..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary-purple transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchSubmissions}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {loading && submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <RefreshCw className="animate-spin mb-4" size={40} />
                    <p className="font-heading uppercase tracking-widest text-sm">Decoding Submissions...</p>
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <div className="glass-card p-12 text-center border-dashed">
                    <p className="text-white/40">No matching biometric signatures found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredSubmissions.map((sub, idx) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden"
                        >
                            {/* Animated Accent Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-blue to-primary-purple opacity-50 group-hover:opacity-100 transition-opacity" />

                            {/* Client Avatar & Basic Info */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <User size={28} className="text-white/40" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold font-heading">{sub.name}</h3>
                                        <span className={`text-[10px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 rounded border ${getGoalColor(sub.goal)}`}>
                                            {sub.goal.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/40">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(sub.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{sub.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Biometric Snapshot */}
                            <div className="grid grid-cols-3 gap-8 md:px-12 py-4 md:py-0 border-y md:border-y-0 md:border-x border-white/5">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase text-white/30 tracking-widest mb-1">BMI</p>
                                    <p className="text-xl font-bold text-primary-blue">{sub.bmi}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase text-white/30 tracking-widest mb-1">TDEE</p>
                                    <p className="text-xl font-bold text-primary-purple">{sub.tdee}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase text-white/30 tracking-widest mb-1">Status</p>
                                    <div className="flex justify-center">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                <a
                                    href={sub.report_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all"
                                >
                                    <ExternalLink size={16} />
                                    <span>View Report</span>
                                </a>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-blue/10 hover:bg-primary-blue/20 border border-primary-blue/20 text-primary-blue rounded-xl text-sm transition-all">
                                    <Download size={16} />
                                    <span>Export JSON</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
