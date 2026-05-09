import React from "react";

const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizeClass = { sm: "h-5 w-5", md: "h-10 w-10", lg: "h-14 w-14" }[size];

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClass} animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600`} />
      {size !== "sm" && <p className="text-sm text-slate-400 font-medium">Loading...</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
