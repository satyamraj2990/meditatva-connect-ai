import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveDashboardLayout } from "@/components/ResponsiveDashboardLayout";
import type { SidebarItem } from "@/components/ResponsiveDashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NearbyPharmacyFinder } from "@/components/NearbyPharmacyFinder";
import {
  Home, Calendar, MapPin, MessageCircle,
  Heart, FolderOpen, Package, Star, Clock, CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const PatientDashboardResponsive = memo(() => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [showNearbyFinder, setShowNearbyFinder] = useState(false);

  const menuItems: SidebarItem[] = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      description: "Dashboard overview",
      iconBg: '#14b8a6',
    },
    {
      id: "appointments",
      icon: Calendar,
      label: "Appointments",
      description: "Book & manage visits",
      iconBg: '#f97316',
      badge: 3,
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: "Chat",
      description: "AI Health Assistant",
      iconBg: '#06b6d4',
    },
    {
      id: "nearby",
      icon: MapPin,
      label: "Find Stores",
      description: "Locate pharmacies",
      iconBg: '#8b5cf6',
      onClick: () => setShowNearbyFinder(true),
    },
    {
      id: "orders",
      icon: Package,
      label: "My Orders",
      description: "Track deliveries",
      iconBg: '#f59e0b',
      badge: 2,
    },
    {
      id: "cabinet",
      icon: FolderOpen,
      label: "Medicine Cabinet",
      description: "Your prescriptions",
      iconBg: '#10b981',
    },
    {
      id: "health",
      icon: Heart,
      label: "Health Records",
      description: "Medical history",
      iconBg: '#ef4444',
    },
  ];

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (!isAuth || role !== "patient") {
      navigate("/login?role=patient");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    try { 
      sessionStorage.removeItem("patientLocationData");
      sessionStorage.removeItem("patientLocation");
    } catch (e) { /* ignore */ }
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <ResponsiveDashboardLayout
        sidebarItems={menuItems}
        activeItem={activeSection}
        onItemClick={setActiveSection}
        userName="Aarav Sharma"
        userEmail="aarav.sharma@gmail.com"
        healthScore={91}
        theme="patient"
        logoText="MediTatva"
        logoSubtext="Premium Health Care"
        onLogout={handleLogout}
      >
        {/* Hero Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Welcome Back,
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Aarav Sharma
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Your health dashboard at a glance</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MapPin, label: "Find Stores", color: "from-purple-500 to-pink-500", action: () => setShowNearbyFinder(true) },
            { icon: Package, label: "Order Medicine", color: "from-blue-500 to-cyan-500" },
            { icon: Calendar, label: "Book Appointment", color: "from-orange-500 to-amber-500" },
            { icon: Heart, label: "Health Check", color: "from-rose-500 to-red-500" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card
                className="p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-gray-700 transition-all cursor-pointer group min-h-[44px]"
                onClick={item.action}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-white font-semibold">{item.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Top Pharmacies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Top Rated Pharmacies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "MedPlus Pharmacy", rating: 4.8, distance: "1.2 km", open: true },
              { name: "Apollo Pharmacy", rating: 4.7, distance: "2.5 km", open: true },
              { name: "Wellness Forever", rating: 4.6, distance: "3.1 km", open: false },
            ].map((pharmacy, index) => (
              <motion.div
                key={pharmacy.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-teal-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{pharmacy.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{pharmacy.distance} away</span>
                      </div>
                    </div>
                    {pharmacy.open ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Open
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        Closed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{pharmacy.rating}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <Card className="p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800">
            <div className="space-y-4">
              {[
                { action: "Order delivered", time: "2 hours ago", icon: CheckCircle, color: "text-green-400" },
                { action: "Prescription uploaded", time: "1 day ago", icon: FolderOpen, color: "text-blue-400" },
                { action: "Appointment booked", time: "3 days ago", icon: Calendar, color: "text-orange-400" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                  <div className={`h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </ResponsiveDashboardLayout>

      {/* Nearby Pharmacy Finder Modal */}
      <AnimatePresence>
        {showNearbyFinder && (
          <NearbyPharmacyFinder
            variant="patient"
            onClose={() => setShowNearbyFinder(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
});

PatientDashboardResponsive.displayName = "PatientDashboardResponsive";

export default PatientDashboardResponsive;
