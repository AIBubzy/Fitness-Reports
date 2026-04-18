import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Loader2, Sparkles, User, Scale, Ruler, Target, Activity as ActivityIcon } from 'lucide-react'
import axios from 'axios'

export default function ClientForm() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        goal: 'general',
        activityLevel: 'sedentary',
        injuries: '',
        email: ''
    })

    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('loading')
        try {
            const resp = await axios.post('/api/submit', formData)
            setResult(resp.data)
            setStatus('success')
        } catch (err) {
            console.error(err)
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 text-center max-w-2xl mx-auto neon-border"
            >
                <div className="w-20 h-20 bg-primary-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
                    <CheckCircle2 size={40} className="text-primary-blue" />
                </div>
                <h2 className="text-3xl font-bold mb-2 font-heading">Assessment Complete!</h2>
                <p className="text-white/60 mb-8">Your personalized report has been generated and sent to {formData.email}.</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">BMI</p>
                        <p className="text-2xl font-bold text-primary-blue">{result.calculations.bmi}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">TDEE</p>
                        <p className="text-2xl font-bold text-primary-purple">{result.calculations.tdee} kcal</p>
                    </div>
                </div>

                <button
                    onClick={() => setStatus('idle')}
                    className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-purple rounded-xl font-bold hover:opacity-90 transition-all"
                >
                    New Assessment
                </button>
            </motion.div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto bg-black/20 p-1">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-primary-blue mb-4">
                    <Sparkles size={14} />
                    <span>AI-POWERED ANALYSIS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                    Human <span className="text-primary-blue">Optimization</span> Engine
                </h1>
                <p className="text-white/50 max-w-lg mx-auto">
                    Input your biometrics to generate a professional-grade metabolic report and 1-week training/nutrition protocol.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <User className="text-primary-blue" size={20} />
                        <h3 className="font-heading font-bold uppercase tracking-wider text-sm">Bio-Identity</h3>
                    </div>

                    <div>
                        <label className="text-xs text-white/40 uppercase ml-1">Full Name</label>
                        <input
                            required name="name" value={formData.name} onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-white/40 uppercase ml-1">Age</label>
                            <input
                                required type="number" name="age" value={formData.age} onChange={handleChange}
                                placeholder="25"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-white/40 uppercase ml-1">Gender</label>
                            <select
                                name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-white/40 uppercase ml-1">Email (For Report Delivery)</label>
                        <input
                            required type="email" name="email" value={formData.email} onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Biometrics */}
                <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Scale className="text-primary-purple" size={20} />
                        <h3 className="font-heading font-bold uppercase tracking-wider text-sm">Vital Metrics</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-white/40 uppercase ml-1">Weight (kg)</label>
                            <div className="relative">
                                <input
                                    required type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange}
                                    placeholder="75.0"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                                />
                                <span className="absolute right-4 top-4 text-white/20 text-sm">kg</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-white/40 uppercase ml-1">Height (cm)</label>
                            <div className="relative">
                                <input
                                    required type="number" name="height" value={formData.height} onChange={handleChange}
                                    placeholder="180"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                                />
                                <span className="absolute right-4 top-4 text-white/20 text-sm">cm</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-white/40 uppercase ml-1">Activity Level</label>
                        <select
                            name="activityLevel" value={formData.activityLevel} onChange={handleChange}
                            className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all"
                        >
                            <option value="sedentary">Sedentary (Office job)</option>
                            <option value="light">Lightly Active (1-2 days/week)</option>
                            <option value="moderate">Moderately Active (3-5 days/week)</option>
                            <option value="very">Very Active (6-7 days/week)</option>
                            <option value="extra">Extra Active (Elite Athlete)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-white/40 uppercase ml-1">Primary Fitness Goal</label>
                        <select
                            name="goal" value={formData.goal} onChange={handleChange}
                            className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-primary-blue outline-none transition-all underline decoration-primary-blue"
                        >
                            <option value="weight_loss">Weight Loss / Definition</option>
                            <option value="muscle_gain">Hypertrophy / Muscle Gain</option>
                            <option value="performance">Athletic Performance</option>
                            <option value="general">General Fitness & Health</option>
                        </select>
                    </div>
                </div>

                {/* Limitations */}
                <div className="md:col-span-2 glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <ActivityIcon className="text-primary-pink" size={20} />
                        <h3 className="font-heading font-bold uppercase tracking-wider text-sm">Physical Constraints</h3>
                    </div>
                    <textarea
                        name="injuries" value={formData.injuries} onChange={handleChange}
                        placeholder="Any injuries, allergies, or medical limitations? (Optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-pink h-24 transition-all"
                    />
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-5 bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink rounded-2xl font-bold text-lg shadow-neon group flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="animate-spin" />
                                INITIATING NEURAL ANALYSIS...
                            </>
                        ) : (
                            <>
                                GENERATE OPTIMIZATION REPORT
                                <Target className="group-hover:rotate-45 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {status === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
                    <AlertCircle size={20} />
                    <span>Something went wrong. Please check your inputs or try again later.</span>
                </div>
            )}
        </div>
    )
}
