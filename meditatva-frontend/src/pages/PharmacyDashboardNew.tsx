import { memo, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PremiumSidebar } from "@/components/PremiumSidebar";
import type { SidebarItem } from "@/components/PremiumSidebar";
import {
  ShoppingCart, Receipt, PackageSearch, BarChart3, MessageCircle,
  Sparkles, Settings
} from "lucide-react";
import { toast } from "sonner";

type Tab = "order-requests" | "billing" | "inventory" | "analytics" | "chat" | "ai";

export const PharmacyDashboard = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("order-requests");

  const menuItems: SidebarItem[] = [
    {
      id: "order-requests",
      icon: ShoppingCart,
      label: "Appointments",
      description: "Book & manage visits",
      iconBg: '#f97316',
      badge: 12,
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: "Chat",
      description: "AI Health Assistant",
      iconBg: '#06b6d4',
    },
    {
      id: "billing",
      icon: Receipt,
      label: "Settings",
      description: "Profile & preferences",
      iconBg: '#64748b',
    },
    {
      id: "inventory",
      icon: PackageSearch,
      label: "Inventory Management",
      description: "Stock & suppliers",
      iconBg: '#8b5cf6',
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics & Reports",
      description: "Performance insights",
      iconBg: '#f59e0b',
    },
    {
      id: "ai",
      icon: Sparkles,
      label: "AI Insights",
      description: "Smart recommendations",
      iconBg: '#6366f1',
    },
    {
      id: "logout",
      icon: Settings,
      label: "Logout",
      onClick: handleLogout,
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

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    try { 
      sessionStorage.removeItem("pharmacyLocationData");
      sessionStorage.removeItem("pharmacyLocation");
    } catch (e) { /* ignore */ }
    toast.success("Logged out successfully");
    navigate("/login");
  }

  const handleItemClick = (id: string) => {
    if (id !== 'logout') {
      setActiveTab(id as Tab);
      navigate(`/pharmacy/dashboard/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <PremiumSidebar
        sidebarItems={menuItems}
        activeItem={activeTab}
        onItemClick={handleItemClick}
        userName="Pharmacist"
        userEmail="pharmacist@meditatva.com"
        theme="pharmacy"
        logoText="MediTatva"
        logoSubtext="Pharmacy Portal"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </PremiumSidebar>
    </div>
  );
});

PharmacyDashboard.displayName = "PharmacyDashboard";
