import CropSenseLogo from "./CropSenseLogo";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto flex flex-col items-center gap-4 px-6 text-center">
        <CropSenseLogo size="lg" />
        <p className="font-body text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} CropSense. Growing a smarter, food-secure world.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
