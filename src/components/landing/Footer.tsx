import logoImg from "@/assets/cropsense-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto flex flex-col items-center gap-4 px-6 text-center">
        <img src={logoImg} alt="CropSense" className="h-10 w-auto brightness-0 invert opacity-80" />
        <p className="font-body text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} CropSense. Growing a smarter, food-secure world.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
