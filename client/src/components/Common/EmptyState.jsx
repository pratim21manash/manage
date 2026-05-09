import React from "react";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={24} className="text-slate-400" />
        </div>
      )}
      <p className="font-medium text-slate-700 mb-1">{title}</p>
      {description && <p className="text-sm text-slate-400 mb-4">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
