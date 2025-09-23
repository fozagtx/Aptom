import React from "react";

type TabOption = {
  key: string;
  label: string;
};

interface TabNavProps {
  options: TabOption[];
  activeKey: string;
  onChange: (key: string) => void;
}

export const TabNav: React.FC<TabNavProps> = ({
  options,
  activeKey,
  onChange,
}) => {
  return (
    <nav className="flex space-x-2 border-b mb-6">
      {options.map((tab) => (
        <button
          key={tab.key}
          className={`relative px-4 py-2 font-medium transition-colors duration-200 rounded-t-lg focus:outline-none
            ${
              activeKey === tab.key
                ? "bg-white border-b-2 border-blue-600 text-blue-700 shadow"
                : "bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-white"
            }
          `}
          aria-current={activeKey === tab.key ? "page" : undefined}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {activeKey === tab.key && (
            <span className="absolute left-0 right-0 -bottom-2 h-1 bg-blue-600 rounded"></span>
          )}
        </button>
      ))}
    </nav>
  );
};
