"use client";

import React from "react";

interface SpinnerProps {
  color?: "primary" | "secondary" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ 
  color = "primary", 
  size = "md", 
  className = "" 
}: SpinnerProps) {
  // Define size classes
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  // Define color classes
  const colorClasses = {
    primary: "border-blue-600 border-t-transparent",
    secondary: "border-purple-600 border-t-transparent",
    white: "border-white border-t-transparent"
  };

  // Inline styles for the animation to ensure it works
  const spinnerStyle = {
    animation: "spin 1s linear infinite",
  };

  // Define the keyframes for the animation
  const keyframes = `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <>
      {/* Include the keyframes in the DOM */}
      <style>{keyframes}</style>
      
      <div 
        className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        style={spinnerStyle}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}