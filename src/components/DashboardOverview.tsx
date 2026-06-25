import { StudioStats, Booking, Review, Payment } from "../types";
import { REVENUE_TREND_DATA, SERVICE_POPULARITY } from "../data/mockData";
import { DollarSign, Calendar, Users, Star, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface DashboardOverviewProps {
  stats: StudioStats;
  bookings: Booking[];
  reviews: Review[];
  payments: Payment[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ stats, bookings, reviews, payments, setActiveTab }: DashboardOverviewProps) {
  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Extract SVG chart calculation parameters
  const chartHeight = 160;
  const chartWidth = 500;
  const maxRevenue = Math.max(...REVENUE_TREND_DATA.map((d) => d.revenue)) * 1.1; // Add 10% headroom
  const minRevenue = Math.min(...REVENUE_TREND_DATA.map((d) => d.revenue)) * 0.9;

  // Generate SVG coordinates for custom elegant curve
  const points = REVENUE_TREND_DATA.map((d, i) => {
    const x = (i / (REVENUE_TREND_DATA.length - 1)) * chartWidth;
    const y = chartHeight - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * (chartHeight - 20);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Smooth bezier curve logic
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, "");

  // Gradient area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Filter 3 recent bookings & 2 recent reviews for quick widgets
  const recentBookings = [...bookings]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 3);

  const recentReviews = [...reviews]
    .filter((r) => r.rating >= 4)
    .slice(0, 2);

  return (
    <div className="space-y-8" id="dashboard-overview-container">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] gap-4">
        <div>
          <span className="text-[#C5A880] text-xs font-mono uppercase tracking-[0.2em] block mb-2">
            Workspace Overview
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-normal text-[#1A1A1A] tracking-wide">
            Welcome to Aura Luxe Studio
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Exquisite management panel for your premium beauty spa & hair atelier.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Atelier Status: Fully Active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="kpi-grid">
        {/* Total Revenue */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-2xl border border-[#EAE8E4] flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.01)]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#C5A880]">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.revenueChange}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-wider block">Total Revenue</span>
            <span className="font-display text-2xl font-semibold text-[#1A1A1A] mt-1 block">
              {formatCurrency(stats.totalRevenue)}
            </span>
            <span className="text-stone-400 text-[11px] mt-1 block">vs last calendar month</span>
          </div>
        </motion.div>

        {/* Total Bookings */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-2xl border border-[#EAE8E4] flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.01)]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#C5A880]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.bookingsChange}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-wider block">Appointments</span>
            <span className="font-display text-2xl font-semibold text-[#1A1A1A] mt-1 block">
              {stats.totalBookings}
            </span>
            <span className="text-stone-400 text-[11px] mt-1 block">total scheduled beauty rituals</span>
          </div>
        </motion.div>

        {/* Active Clients */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-2xl border border-[#EAE8E4] flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.01)]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#C5A880]">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.clientsChange}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-wider block">VIP Clients</span>
            <span className="font-display text-2xl font-semibold text-[#1A1A1A] mt-1 block">
              {stats.activeClients}
            </span>
            <span className="text-stone-400 text-[11px] mt-1 block">active luxury membership</span>
          </div>
        </motion.div>

        {/* Average Rating */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-2xl border border-[#EAE8E4] flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.01)]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#C5A880]">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 mr-0.5 text-amber-500" />
              Exquisite
            </span>
          </div>
          <div className="mt-4">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-wider block">Client Satisfaction</span>
            <span className="font-display text-2xl font-semibold text-[#1A1A1A] mt-1 block">
              {stats.averageRating} <span className="text-stone-400 text-sm font-normal">/ 5.0</span>
            </span>
            <span className="text-stone-400 text-[11px] mt-1 block">from {stats.ratingCount} certified reviews</span>
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Popularity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE8E4] lg:col-span-2 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-lg font-normal text-[#1A1A1A] tracking-wide">
                  Revenue Growth & Flow
                </h3>
                <p className="text-stone-400 text-xs">
                  Monthly progression of studio earnings
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-mono bg-[#FAF9F6] border border-[#EAE8E4] px-3 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>H1 Growth Cycle</span>
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="relative pt-4 w-full h-[200px]" id="revenue-svg-chart">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5A880" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C5A880" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#FAF9F6" strokeWidth="1" />
                <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="#FAF9F6" strokeWidth="1" />
                <line x1="0" y1="110" x2={chartWidth} y2="110" stroke="#FAF9F6" strokeWidth="1" />
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#EAE8E4" strokeWidth="1" />

                {/* Area under curve */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* The curved line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#C5A880" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />

                {/* Point circles & labels */}
                {points.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="4.5" 
                      fill="#FFFFFF" 
                      stroke="#C5A880" 
                      strokeWidth="2.5" 
                    />
                    {/* Tooltip on top */}
                    <text 
                      x={p.x} 
                      y={p.y - 12} 
                      textAnchor="middle" 
                      fill="#1A1A1A" 
                      className="text-[10px] font-semibold font-mono hidden md:block"
                    >
                      {formatCurrency(p.revenue)}
                    </text>
                  </g>
                ))}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2 px-1 border-t border-[#FAF9F6] pt-1.5">
                {REVENUE_TREND_DATA.map((d, i) => (
                  <span key={i} className="text-[10px] font-semibold text-stone-400 font-mono">
                    {d.month}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-[#EAE8E4] pt-4 mt-6">
            <div>
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Average Monthly</span>
              <span className="text-base font-semibold text-stone-800 font-mono mt-0.5 block">$19,715</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Peak Revenue</span>
              <span className="text-base font-semibold text-stone-800 font-mono mt-0.5 block">$24,890</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Forecast (Jul)</span>
              <span className="text-base font-semibold text-[#C5A880] font-mono mt-0.5 block">$27,500</span>
            </div>
          </div>
        </div>

        {/* Services Popularity Widget */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-normal text-[#1A1A1A] tracking-wide mb-1">
              Popular Rituals
            </h3>
            <p className="text-stone-400 text-xs mb-6">
              Most requested atelier services this cycle
            </p>

            <div className="space-y-4" id="popular-rituals-list">
              {SERVICE_POPULARITY.map((service, index) => {
                const totalRitualCount = SERVICE_POPULARITY.reduce((acc, s) => acc + s.count, 0);
                const percent = Math.round((service.count / totalRitualCount) * 100);

                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-stone-700 truncate max-w-[190px]">
                        {service.name}
                      </span>
                      <span className="font-mono text-stone-400">
                        {service.count} appointments
                      </span>
                    </div>
                    {/* Premium Progress Bar */}
                    <div className="h-1.5 w-full bg-[#FAF9F6] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#C5A880] rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span>{percent}% volume</span>
                      <span className="text-stone-700 font-medium">{formatCurrency(service.revenue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("bookings")}
            className="w-full mt-6 text-center border border-[#EAE8E4] hover:bg-[#FAF9F6] text-stone-600 py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase transition-colors"
          >
            Manage Services
          </button>
        </div>
      </div>

      {/* Recent Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings Panel */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-lg font-normal text-[#1A1A1A] tracking-wide">
                  Latest Bookings
                </h3>
                <p className="text-stone-400 text-xs">
                  Awaiting arrival or recently scheduled
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("bookings")}
                className="text-xs text-[#C5A880] font-semibold tracking-wider hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-[#EAE8E4]" id="dashboard-recent-bookings">
              {recentBookings.map((b) => (
                <div key={b.id} className="py-3.5 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-stone-800 block">
                      {b.clientName}
                    </span>
                    <span className="text-stone-400 text-[11px] block">
                      {b.serviceName} • <span className="font-mono text-[#C5A880]">{b.time}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-stone-800 block">
                      {formatCurrency(b.price)}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-medium mt-1 uppercase tracking-wider ${
                      b.status === "Confirmed" 
                        ? "bg-amber-50 text-amber-600" 
                        : b.status === "Completed"
                        ? "bg-stone-100 text-stone-600"
                        : "bg-[#FAF9F6] text-stone-400"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Reviews Panel */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-lg font-normal text-[#1A1A1A] tracking-wide">
                  Top Feedback
                </h3>
                <p className="text-stone-400 text-xs">
                  Latest published client ratings & journals
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("reviews")}
                className="text-xs text-[#C5A880] font-semibold tracking-wider hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-4" id="dashboard-recent-reviews">
              {recentReviews.map((r) => (
                <div key={r.id} className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#EAE8E4] space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-semibold text-stone-800 block">{r.clientName}</span>
                      <span className="text-stone-400 text-[10px] block">{r.serviceName}</span>
                    </div>
                    {/* Star ratings */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-[#C5A880] fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-xs italic line-clamp-2">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
