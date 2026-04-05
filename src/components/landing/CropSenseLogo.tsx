import React from "react";

interface CropSenseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CropSenseLogo: React.FC<CropSenseLogoProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <span
      className={`font-display font-bold select-none ${sizeClasses[size]} ${className}`}
      style={{
        background: "linear-gradient(90deg, #0B6623 0%, #228B22 30%, #6DBE45 65%, #A8E06C 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      CropSense
    </span>
  );
};

export default CropSenseLogo;
