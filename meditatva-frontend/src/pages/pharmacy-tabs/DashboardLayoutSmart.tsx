import { memo, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmartSidebarLayout } from "@/components/SmartSidebarLayout";
import type { SidebarItem } from "@/components/SmartSidebarLayout";
import {
  ShoppingCart, Receipt, PackageSearch, BarChart3, MessageCircle,
  Sparkles, LogOut, Pill, Bell, Activity
} from "lucide-react";
import { toast } from "sonner";

type Tab = "order-requests" | "billing" | "inventory" | "analytics" | "chat" | "ai";

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8],
  }
};

export const DashboardLayoutSmart = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("order-requests");
  const [scrolled, setScrolled] = useState(false);

  const menuItems: SidebarItem[] = [
    {
      id: "order-requests",
      icon: ShoppingCart,
      label: "Order Requests",
      section: 'main',
      gradient: "from-blue-500 to-cyan-400",
      badge: 12,
    },
    {
      id: "billing",
      icon: Receipt,
      label: "Billing & Invoices",
      section: 'main',
      gradient: "from-emerald-500 to-teal-400"
    },
    {
      id: "inventory",
      icon: PackageSearch,
      label: "Inventory Management",
      section: 'main',
      gradient: "from-violet-500 to-purple-400"
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics & Reports",
      section: 'secondary',
      gradient: "from-orange-500 to-amber-400"
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: "Patient Chat",
      section: 'secondary',
      gradient: "from-pink-500 to-rose-400"
    },
    {
      id: "ai",
      icon: Sparkles,
      label: "AI Insights",
      section: 'secondary',
      gradient: "from-indigo-500 to-blue-400"
    },
  ];

  useEffect(() => {
    const path = location.pathname.split('/').pop() as Tab;
    if (path && ['order-requests', 'billing', 'inventory', 'analytics', 'chat', 'ai'].includes(path)) {
      setActiveTab(path);
    } else if (location.pathname === "/pharmacy/dashboard" || location.pathname === "/pharmacy/dashboard/") {
      navigate("/pharmacy/dashboard/order-requests", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Auth check
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (!isAuth || role !== "pharmacy") {
      navigate("/login?role=pharmacy");
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    try { 
      sessionStorage.removeItem("pharmacyLocationData");
      sessionStorage.removeItem("pharmacyLocation");
    } catch (e) { /* ignore */ }
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleItemClick = (id: string) => {
    setActiveTab(id as Tab);
    navigate(`/pharmacy/dashboard/${id}`);
  };

  const sidebarHeader = (
    <motion.div
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="relative h-12 w-12 rounded-2xl flex items-center justify-center overflow-hidden"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
          }}
        >
          <Pill className="h-6 w-6 text-white" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            MediTatva
          </h1>
          <p className="text-xs text-slate-500 font-medium">Pharmacy Portal</p>
        </motion.div>
      </div>

      {/* Live Status Indicator */}
      <motion.div
        className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-2 w-2 rounded-full bg-emerald-500"
          variants={pulseVariants}
          animate="animate"
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-semibold text-emerald-700">Live Dashboard</span>
      </motion.div>
    </motion.div>
  );

  const sidebarFooter = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Button
        className="w-full group relative overflow-hidden bg-white/60 hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-500 text-rose-600 hover:text-white border-2 border-rose-200 hover:border-rose-500 font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-rose-500/30 py-3"
        onClick={handleLogout}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/20 to-rose-500/0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        <div className="flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-lg bg-rose-500/10 group-hover:bg-white/20 flex items-center justify-center transition-colors"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <LogOut className="h-4 w-4" />
          </motion.div>
          <span>Logout</span>
        </div>
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <SmartSidebarLayout
        sidebarItems={menuItems}
        activeItem={activeTab}
        onItemClick={handleItemClick}
        header={sidebarHeader}
        footer={sidebarFooter}
        theme="pharmacy"
      >
        {/* Floating Navbar */}
        <motion.header
          className={`sticky top-2 sm:top-4 mx-2 sm:mx-4 lg:mx-6 mb-4 sm:mb-6 z-20 rounded-xl sm:rounded-2xl transition-all duration-300 ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-500/10' 
              : 'bg-white/60 backdrop-blur-lg shadow-lg'
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              {/* Breadcrumb */}
              <motion.div
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {menuItems.find(item => item.id === activeTab) && (
                    <>
                      <motion.div
                        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${menuItems.find(item => item.id === activeTab)?.gradient} flex items-center justify-center shrink-0`}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        style={{
                          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)',
                        }}
                      >
                        {(() => {
                          const Icon = menuItems.find(item => item.id === activeTab)?.icon;
                          return Icon ? <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> : null;
                        })()}
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                          {menuItems.find(item => item.id === activeTab)?.label}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">MediTatva Dashboard</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Right Actions */}
              <motion.div
                className="flex items-center gap-1.5 sm:gap-2 lg:gap-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Activity Indicator */}
                <motion.div
                  className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-semibold text-blue-700">Active</span>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-lg sm:rounded-xl hover:bg-blue-500/10 hover:text-blue-600 p-0"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <motion.span
                      className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-gradient-to-r from-rose-500 to-red-500 rounded-full border-2 border-white"
                      variants={pulseVariants}
                      animate="animate"
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>

                {/* Profile */}
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-100 to-blue-50 hover:from-blue-500 hover:to-cyan-500 cursor-pointer group transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15)',
                  }}
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 ring-2 ring-white ring-offset-1 sm:ring-offset-2 ring-offset-blue-100">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=pharmacist" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold text-xs sm:text-sm">
                      PH
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                    <p className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-white transition-colors">
                      Pharmacist
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 group-hover:text-white/80 transition-colors">
                      Admin
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          className="px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6 lg:pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Outlet />
        </motion.main>
      </SmartSidebarLayout>
    </div>
  );
});

DashboardLayoutSmart.displayName = "DashboardLayoutSmart";
