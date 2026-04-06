import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Menu, X, Network } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "@/assets/cropsense-logo.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Impact", href: "#stats" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { scrollDirection, scrollY } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHidden = scrollDirection === "down" && scrollY > 100;
  const hasBg = scrollY > 50;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHidden ? "-translate-y-full" : "translate-y-0"
        } ${hasBg ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/40" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoImg}
            alt="CropSense Logo"
            className="h-10 w-auto mix-blend-multiply drop-shadow-sm transition-transform group-hover:scale-105"
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium transition-colors duration-200 hover:text-primary ${hasBg ? "text-foreground" : "text-primary-foreground"
                }`}
            >
              {link.label}
            </a>
          ))}

          {/* NEW: SUPPLY CHAIN LOGIC LINK */}
          <button
            onClick={() => navigate("/nexus")}
            className="flex items-center gap-2 font-body text-sm font-bold text-emerald-500 transition-all hover:text-emerald-400 group"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <Network className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Supply Chain Logic
          </button>

          {/* DASHBOARD BUTTON */}
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 hover:scale-105 shadow-md"
          >
            Dashboard
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden ${hasBg ? "text-foreground" : "text-primary-foreground"}`}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-6 pb-8 pt-4 animate-fade-up space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 font-body text-foreground hover:text-primary transition-colors border-b border-border/50"
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => { navigate("/nexus"); setMobileOpen(false); }}
            className="flex items-center gap-3 w-full py-3 text-emerald-500 font-bold border-b border-border/50"
          >
            <Network className="h-5 w-5" />
            Supply Chain Logic
          </button>

          <button
            onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
            className="w-full rounded-xl bg-primary py-4 text-center font-bold text-primary-foreground shadow-lg"
          >
            Open Dashboard
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;