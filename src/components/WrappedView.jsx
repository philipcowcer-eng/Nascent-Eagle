import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShoppingBag, Calendar, TrendingUp, DollarSign, Package, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WrappedView = ({ data, onReset }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 'intro',
            content: (
                <div style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{
                            width: 112,
                            height: 112,
                            background: 'linear-gradient(135deg, #f97316, #f43f5e)',
                            borderRadius: 24,
                            margin: '0 auto 40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                        }}
                    >
                        <ShoppingBag style={{ width: 56, height: 56, color: 'white' }} />
                    </motion.div>
                    <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#000', marginBottom: 24, letterSpacing: '-0.02em' }}>
                        Your Amazon<br />Wrapped
                    </h1>
                    <p style={{ fontSize: '20px', color: '#444', fontWeight: 500 }}>Ready to see what you bought in 2025?</p>
                </div>
            ),
            bg: 'bg-tie-dye-coral'
        },
        {
            id: 'total',
            content: (
                <div style={{ textAlign: 'center' }}>
                    <div className="glass-card" style={{ borderRadius: '24px', padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
                        <DollarSign style={{ width: 64, height: 64, color: '#059669', margin: '0 auto 24px' }} />
                        <p style={{ fontSize: '18px', color: '#555', marginBottom: '16px', fontWeight: 500 }}>You spent a total of</p>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                            style={{ fontSize: '48px', fontWeight: 900, color: '#000', marginBottom: '16px' }}
                        >
                            ${data.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </motion.div>
                        <p style={{ color: '#666' }}>That's a lot of packages! 📦</p>
                    </div>
                </div>
            ),
            bg: 'bg-tie-dye-sage'
        },
        {
            id: 'peak',
            content: (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 672, margin: '0 auto' }}>
                    <div className="glass-card" style={{ borderRadius: 24, padding: '32px 40px' }}>
                        <TrendingUp style={{ width: 48, height: 48, color: '#7c3aed', margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#000', marginBottom: 32 }}>Peak Shopping Spree</h2>
                        <div style={{ height: 224, width: '100%', marginBottom: 24 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.monthlyTrend}>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#374151"
                                        tickFormatter={(val) => val.split('-')[1]}
                                        fontSize={12}
                                    />
                                    <YAxis stroke="#374151" fontSize={12} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                        labelStyle={{ color: '#000', fontWeight: 600 }}
                                        formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
                                    />
                                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                        {data.monthlyTrend.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={data.peakMonth && entry.date === data.peakMonth.date ? '#7c3aed' : '#c4b5fd'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {data.peakMonth && (
                            <p style={{ fontSize: 18, color: '#333' }}>
                                You went wild in <span style={{ color: '#7c3aed', fontWeight: 700 }}>{data.peakMonth.date}</span> spending{' '}
                                <span style={{ color: '#059669', fontWeight: 700 }}>${data.peakMonth.amount.toFixed(2)}</span>
                            </p>
                        )}
                    </div>
                </div>
            ),
            bg: 'bg-tie-dye-lavender'
        },
        {
            id: 'top-items',
            content: (
                <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
                    <div className="glass-card" style={{ borderRadius: 24, padding: 40 }}>
                        <Sparkles style={{ width: 48, height: 48, color: '#0284c7', margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#000', marginBottom: 8 }}>Most Purchased Items</h2>
                        <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>Your top 5 by frequency</p>
                        {data.topItems.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.topItems.slice(0, 5).map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            marginBottom: 8,
                                            backgroundColor: i === 0 ? '#e0f2fe' : '#f8fafc',
                                            borderRadius: 12,
                                            borderLeft: i === 0 ? '4px solid #0284c7' : 'none'
                                        }}
                                    >
                                        <span style={{ color: '#333', fontSize: 14, textAlign: 'left', flex: 1, marginRight: 16 }}>{item.name}</span>
                                        <span style={{ color: '#0284c7', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>{item.count}x</span>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#666' }}>Not enough data.</p>
                        )}
                    </div>
                </div>
            ),
            bg: 'bg-tie-dye-sky'
        },
        {
            id: 'big-spenders',
            content: (
                <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
                    <div className="glass-card" style={{ borderRadius: 24, padding: 40 }}>
                        <DollarSign style={{ width: 48, height: 48, color: '#d97706', margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#000', marginBottom: 8 }}>Biggest Purchases</h2>
                        <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>Your top 5 by dollar amount</p>
                        {data.topItemsBySpend && data.topItemsBySpend.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.topItemsBySpend.slice(0, 5).map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            marginBottom: 8,
                                            backgroundColor: i === 0 ? '#fef3c7' : '#f8fafc',
                                            borderRadius: 12,
                                            borderLeft: i === 0 ? '4px solid #d97706' : 'none'
                                        }}
                                    >
                                        <span style={{ color: '#333', fontSize: 14, textAlign: 'left', flex: 1, marginRight: 16 }}>{item.name}</span>
                                        <span style={{ color: '#d97706', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>${item.amount.toFixed(2)}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#666' }}>Not enough data.</p>
                        )}
                    </div>
                </div>
            ),
            bg: 'bg-tie-dye-gold'
        },
        {
            id: 'summary',
            content: (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 896, margin: '0 auto', padding: '0 16px' }}>
                    <h2 style={{ fontSize: 40, fontWeight: 700, color: '#000', marginBottom: 12 }}>Your 2025 Wrapped</h2>
                    <p style={{ fontSize: 18, color: '#444', marginBottom: 40 }}>Here's everything at a glance</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                        <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
                            <DollarSign style={{ width: 40, height: 40, color: '#059669', margin: '0 auto 12px' }} />
                            <p style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Total Spent</p>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#000' }}>
                                ${data.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
                            <Package style={{ width: 40, height: 40, color: '#0284c7', margin: '0 auto 12px' }} />
                            <p style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Orders Placed</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: '#000' }}>{data.totalOrders}</p>
                        </div>

                        <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
                            <TrendingUp style={{ width: 40, height: 40, color: '#d97706', margin: '0 auto 12px' }} />
                            <p style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Avg Order Value</p>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#000' }}>
                                ${data.totalOrders > 0 ? (data.totalSpend / data.totalOrders).toFixed(2) : '0.00'}
                            </p>
                        </div>

                        <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
                            <Calendar style={{ width: 40, height: 40, color: '#7c3aed', margin: '0 auto 12px' }} />
                            <p style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Shopping Period</p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>
                                {data.earliestDate.toLocaleDateString('en-US', { month: 'short' })} - {data.latestDate.toLocaleDateString('en-US', { month: 'short' })}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
                        {/* Most Frequent Items - Left column */}
                        <div className="glass-card" style={{ borderRadius: 16, padding: 20, textAlign: 'left' }}>
                            <h3 style={{ color: '#000', marginBottom: 16, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16 }}>
                                <ShoppingBag style={{ width: 20, height: 20, marginRight: 8, color: '#0284c7' }} /> Most Frequent Items
                            </h3>
                            {data.topItems.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {data.topItems.slice(0, 5).map((item, i) => (
                                        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                                            <span style={{ color: '#333' }}>{item.name}</span>
                                            <span style={{ color: '#0284c7', fontWeight: 600 }}>{item.count}x</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#666', fontSize: 14 }}>No item data available</p>
                            )}
                        </div>

                        {/* Spending by Category - Right column */}
                        <div className="glass-card" style={{ borderRadius: 16, padding: 20, textAlign: 'left' }}>
                            <h3 style={{ color: '#000', marginBottom: 16, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16 }}>
                                <TrendingUp style={{ width: 20, height: 20, marginRight: 8, color: '#059669' }} /> Spending by Category
                            </h3>
                            {data.topCategories.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {data.topCategories.map((cat, i) => (
                                        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                                            <span style={{ color: '#333' }}>{cat.name}</span>
                                            <span style={{ color: '#059669', fontWeight: 600 }}>${cat.value.toFixed(0)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#666', fontSize: 14 }}>Category data not available in your export</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        style={{
                            padding: '16px 32px',
                            backgroundColor: '#000',
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 50,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 16,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        Analyze Another Year
                    </button>
                </div>
            ),
            bg: 'bg-tie-dye-peach'
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(c => c - 1);
    };

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden">
            {/* Animated Background Layer */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 w-full h-full ${slides[currentSlide].bg}`}
                />
            </AnimatePresence>

            {/* Content Area - Top 2/3 of screen, centered */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '68vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    overflow: 'auto'
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35 }}
                        style={{ width: '100%', maxWidth: '1024px', margin: '0 auto' }}
                    >
                        {slides[currentSlide].content}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls - At top of bottom 1/3 */}
            <div
                style={{
                    position: 'absolute',
                    top: '68vh',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    padding: '0 1rem',
                    zIndex: 20
                }}
            >
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    style={{
                        padding: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        cursor: currentSlide === 0 ? 'default' : 'pointer',
                        opacity: currentSlide === 0 ? 0 : 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    aria-label="Previous slide"
                >
                    <ChevronLeft style={{ width: 24, height: 24, color: '#1a1a1a' }} />
                </button>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            style={{
                                width: i === currentSlide ? '32px' : '10px',
                                height: '10px',
                                borderRadius: '5px',
                                backgroundColor: i === currentSlide ? '#1a1a1a' : '#999',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    style={{
                        padding: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        cursor: currentSlide === slides.length - 1 ? 'default' : 'pointer',
                        opacity: currentSlide === slides.length - 1 ? 0 : 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    aria-label="Next slide"
                >
                    <ChevronRight style={{ width: 24, height: 24, color: '#1a1a1a' }} />
                </button>
            </div>
        </div>
    );
};

export default WrappedView;
