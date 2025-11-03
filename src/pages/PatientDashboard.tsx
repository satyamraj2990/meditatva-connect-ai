import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chatbot } from "@/components/Chatbot";
import { 
  Search, MapPin, MessageCircle, Star, Phone, Navigation,
  Clock, Package, Heart, Bell, User, LogOut, Pill, Camera, 
  Calendar, AlertCircle, CheckCircle, XCircle
} from "lucide-react";
import { mockPharmacies, mockMedicines, mockChatMessages, mockSubstitutes, mockRefillReminders } from "@/lib/mockData";
import { toast } from "sonner";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

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
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"...`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="glass-card sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold gradient-text">MediTatva</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">Welcome back, John!</h2>
          <p className="text-muted-foreground">Find medicines near you instantly</p>
        </div>

        {/* Search Section */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for medicines... (e.g., Paracetamol, Ibuprofen)"
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="gradient-primary">
              Search
            </Button>
            <Button onClick={() => setShowScanner(true)} variant="outline" className="gap-2">
              <Camera className="h-4 w-4" />
              MediTatva Lens
            </Button>
          </div>
        </Card>

        {/* Smart Refill Reminders */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Smart Refill Reminders
            </h3>
            <Badge className="gradient-secondary">AI Powered</Badge>
          </div>
          <div className="space-y-3">
            {mockRefillReminders.map((reminder) => (
              <div key={reminder.id} className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{reminder.medicineName}</p>
                    {reminder.status === "due-today" && (
                      <Badge variant="destructive" className="h-5">Due Today</Badge>
                    )}
                    {reminder.status === "overdue" && (
                      <Badge variant="destructive" className="h-5 bg-red-600">Overdue</Badge>
                    )}
                    {reminder.status === "due-soon" && (
                      <Badge className="gradient-secondary h-5">Due Soon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {reminder.pharmacy} • Next refill: {new Date(reminder.nextRefill).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Remind Me
                  </Button>
                  <Button size="sm" className="gradient-primary">
                    Reserve Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pharmacy List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold">Nearby Pharmacies</h3>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Map View
              </Button>
            </div>

            {mockPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="glass-card p-6 card-hover cursor-pointer"
                onClick={() => setSelectedPharmacy(pharmacy.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{pharmacy.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {pharmacy.address} • {pharmacy.distance}
                    </p>
                  </div>
                  <Badge variant={pharmacy.isOpen ? "default" : "secondary"} className={pharmacy.isOpen ? "gradient-secondary" : ""}>
                    {pharmacy.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{pharmacy.rating}</span>
                    <span className="text-sm text-muted-foreground">({pharmacy.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Open until 10 PM
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="gradient-primary flex-1">
                    <Package className="h-4 w-4 mr-2" />
                    View Medicines
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowChat(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Substitutes */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-heading font-bold mb-4">AI Substitute Suggestions</h3>
              <div className="space-y-3">
                {mockSubstitutes.slice(0, 2).map((sub) => (
                  <div key={sub.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{sub.substitute}</p>
                        <p className="text-xs text-muted-foreground">Alternative to {sub.original}</p>
                      </div>
                      <Badge className="gradient-secondary">{sub.savings} off</Badge>
                    </div>
                    <p className="text-lg font-bold text-primary">${sub.price}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sub.pharmacy}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 gradient-primary">View All Alternatives</Button>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-heading font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Pharmacies
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  My Reservations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </Card>

            {/* Health Tips */}
            <Card className="glass-card p-6 gradient-accent">
              <h3 className="text-lg font-heading font-bold mb-2 text-white">💡 Health Tip</h3>
              <p className="text-sm text-white/90">
                Always check medicine expiry dates and store them in a cool, dry place away from direct sunlight.
              </p>
            </Card>
          </div>
        </div>

        {/* MediTatva Lens Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowScanner(false)}
          >
            <Card className="glass-card w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gradient-primary p-4 flex justify-between items-center">
                <h3 className="text-white font-heading font-bold flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  MediTatva Lens - AI Scanner
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowScanner(false)} className="text-white">
                  Close
                </Button>
              </div>
              <div className="p-6">
                <div className="bg-muted/50 rounded-lg h-64 flex items-center justify-center mb-4 border-2 border-dashed">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Point camera at medicine packaging</p>
                    <Button className="gradient-primary">
                      Start Camera
                    </Button>
                  </div>
                </div>
                
                {/* Simulated Scan Result */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Medicine Identified!</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">Paracetamol 500mg</h4>
                  <p className="text-sm text-muted-foreground mb-4">Common pain reliever and fever reducer</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="gradient-primary">
                      <Search className="h-4 w-4 mr-2" />
                      Find Near Me
                    </Button>
                    <Button variant="outline">
                      View Substitutes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Chat Overlay */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowChat(false)}
          >
            <Card className="glass-card w-full max-w-2xl h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gradient-primary p-4 flex justify-between items-center">
                <h3 className="text-white font-heading font-bold">Chat with Pharmacy</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowChat(false)} className="text-white">
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isPatient ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.isPatient 
                        ? "bg-gradient-to-br from-primary to-primary-light text-white"
                        : "bg-muted"
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Type your message..." />
                  <Button className="gradient-primary">Send</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default PatientDashboard;
