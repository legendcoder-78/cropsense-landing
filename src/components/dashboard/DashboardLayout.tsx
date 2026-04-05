import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/cropsense-logo.png";
import {
  LayoutDashboard,
  User,
  CloudRain,
  AlertTriangle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type Tab = "overview" | "profile" | "climate" | "predictions";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "climate", label: "Climate", icon: CloudRain },
  { id: "predictions", label: "Predictions", icon: AlertTriangle },
];

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <img src={logoImg} alt="CropSense" className="h-8 w-auto mix-blend-multiply" />
          <span className="font-display text-lg font-bold text-foreground">Dashboard</span>
          <button
            className="ml-auto lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onTabChange(id);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-3">
          <div className="px-4">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
