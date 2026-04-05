import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImg from "@/assets/cropsense-logo.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Impact", href: "#stats" },
  { label: "Join Us", href: "#cta" },
];

const Navbar = () => {
  const { scrollDirection, scrollY } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHidden = scrollDirection === "down" && scrollY > 100;
  const hasBg = scrollY > 50;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${hasBg ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <a href="#" className="flex items-center gap-2 group">
          <img
            src={logoImg}
            alt="CropSense Logo"
            className="h-10 w-auto mix-blend-multiply drop-shadow-sm"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium transition-colors duration-200 hover:text-primary ${
                hasBg ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 hover:scale-105"
          >
            Get Started
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden ${hasBg ? "text-foreground" : "text-primary-foreground"}`}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-6 pb-6 pt-2 animate-fade-up">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-body text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
