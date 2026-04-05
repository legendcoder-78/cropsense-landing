import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto flex flex-col items-center gap-4 px-6 text-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold text-primary-foreground">CropSense</span>
        </div>
        <p className="font-body text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} CropSense. Growing a smarter, food-secure world.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
