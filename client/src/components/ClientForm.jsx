import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Loader2, Sparkles, User, Scale, Ruler, Target, Activity as ActivityIcon, Camera, ShieldCheck } from 'lucide-react'
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
    const [photo, setPhoto] = useState(null)

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
            const submitData = new FormData();
            Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
            if (photo) submitData.append('photo', photo);

            const resp = await axios.post('/api/submit', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
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
                <h2 className="text-3xl font-bold mb-2 font-heading">Protocol Generated</h2>
                <p className="text-white/60 mb-8">Your specialized assessment has been processed. A copy was sent to {formData.email}.</p>

                {/* Vital Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary-blue/50 transition-colors">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1" title="Body Mass Index">BMI</p>
                        <p className="text-2xl font-bold text-primary-cyan">{result.calculations.bmi}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary-purple/50 transition-colors">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1" title="Basal Metabolic Rate">BMR</p>
                        <p className="text-2xl font-bold text-white">{result.calculations.bmr} <span className="text-xs font-normal text-white/40 tracking-normal">kcal</span></p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary-pink/50 transition-colors">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1" title="Total Daily Energy Expenditure">TDEE</p>
                        <p className="text-2xl font-bold text-white">{result.calculations.tdee} <span className="text-xs font-normal text-white/40 tracking-normal">kcal</span></p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-primary-blue/20 to-primary-purple/20 rounded-2xl border border-primary-blue/30 shadow-neon">
                        <p className="text-xs text-primary-blue uppercase tracking-widest mb-1 font-bold">Target</p>
                        <p className="text-2xl font-bold text-white">{result.calculations.calories} <span className="text-xs font-normal text-white/60 tracking-normal">kcal</span></p>
                    </div>
                </div>

                {/* Macro Breakdown */}
                <div className="mb-8 p-6 bg-[#1a1a1c] border border-white/5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/5 via-primary-purple/5 to-primary-pink/5 opacity-50 z-0"></div>
                    <div className="relative z-10">
                        <h4 className="text-left text-sm font-bold font-heading uppercase text-white/70 mb-4 flex items-center gap-2">
                            <ActivityIcon size={16} className="text-primary-pink" /> 
                            Daily Macro-Nutrient Split
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                <p className="text-2xl font-bold text-primary-blue mb-1">{result.calculations.macros.protein}<span className="text-sm">g</span></p>
                                <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Protein</p>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                                    <motion.div initial={{width:0}} animate={{width:'40%'}} className="h-full bg-primary-blue" transition={{delay: 0.2, duration: 0.8}} />
                                </div>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                <p className="text-2xl font-bold text-primary-purple mb-1">{result.calculations.macros.carbs}<span className="text-sm">g</span></p>
                                <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Carbs</p>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                                    <motion.div initial={{width:0}} animate={{width:'35%'}} className="h-full bg-primary-purple" transition={{delay: 0.4, duration: 0.8}} />
                                </div>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                <p className="text-2xl font-bold text-primary-pink mb-1">{result.calculations.macros.fats}<span className="text-sm">g</span></p>
                                <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Fats</p>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                                    <motion.div initial={{width:0}} animate={{width:'25%'}} className="h-full bg-primary-pink" transition={{delay: 0.6, duration: 0.8}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.reportUrl && result.reportUrl !== 'local' && result.reportUrl !== '#' && (
                        <a 
                            href={result.reportUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/20 rounded-xl font-bold hover:bg-white/10 transition-all text-white"
                        >
                            <User size={18} /> View PDF Report
                        </a>
                    )}
                    <button
                        onClick={() => setStatus('idle')}
                        className={`w-full py-4 bg-gradient-to-r from-primary-blue to-primary-purple rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 ${(result.reportUrl && result.reportUrl !== 'local' && result.reportUrl !== '#') ? '' : 'md:col-span-2'}`}
                    >
                        <Target size={18} /> New Assessment
                    </button>
                </div>
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

                {/* Physique Photo Upload */}
                <div className="md:col-span-2 glass-card p-6 relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-cyan"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Camera className="text-primary-cyan" size={20} />
                        <h3 className="font-heading font-bold uppercase tracking-wider text-sm">Visual AI Analysis (Optional)</h3>
                    </div>
                    
                    <div className={`border-2 border-dashed ${photo ? 'border-primary-cyan bg-primary-cyan/5' : 'border-white/10 hover:bg-white/5'} rounded-2xl p-6 text-center cursor-pointer transition-all relative group`}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setPhoto(e.target.files[0])} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex flex-col items-center gap-3 pointer-events-none">
                            <Camera size={32} className={photo ? "text-primary-cyan" : "text-white/20 group-hover:text-white/40 transition-colors"} />
                            <p className="font-bold text-white tracking-wide">
                                {photo ? photo.name : "Tap to upload physique photo"}
                            </p>
                            <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                                For an accurate AI body-fat estimation, men should preferably wear shorts; women should wear form-fitting activewear (e.g., sports bra and shorts).
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <ShieldCheck size={16} className="text-primary-cyan shrink-0 mt-0.5" />
                        <p className="text-xs text-white/60 leading-relaxed">
                            <strong className="text-white/90">Privacy Protocol:</strong> Images are processed securely for real-time AI estimation and instantly purged. They will never be shared, saved, or distributed externally.
                        </p>
                    </div>
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
