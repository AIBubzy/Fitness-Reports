import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, LayoutDashboard, Send } from 'lucide-react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import ClientForm from './components/ClientForm'
import Dashboard from './components/Dashboard'
import ClientPortal from './pages/ClientPortal'

function AdminApp() {
    const location = useLocation()
    const view = location.pathname === '/admin' ? 'dashboard' : 'form'

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary-blue selection:text-black">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center shadow-neon">
                        <Activity className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold font-heading tracking-tight animated-gradient-text">
                        PT FLOW PRO
                    </span>
                </div>

                <div className="flex gap-4">
                    <Link
                        to="/"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${view === 'form' ? 'bg-primary-blue text-black font-semibold' : 'hover:bg-white/10'}`}
                    >
                        <Send size={18} />
                        <span className="hidden sm:inline">Assessment</span>
                    </Link>
                    <Link
                        to="/admin"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${view === 'dashboard' ? 'bg-primary-purple text-white font-semibold shadow-neon-purple' : 'hover:bg-white/10'}`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="hidden sm:inline">Admin</span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <ClientForm />
                            </motion.div>
                        } />
                        <Route path="/admin" element={
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <Dashboard />
                            </motion.div>
                        } />
                    </Routes>
                </AnimatePresence>
            </main>

            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-purple/10 blur-[120px] rounded-full" />
            </div>
        </div>
    )
}

export default function App() {
    return (
        <Routes>
            <Route path="/client/:id/*" element={<ClientPortal />} />
            <Route path="*" element={<AdminApp />} />
        </Routes>
    )
}
