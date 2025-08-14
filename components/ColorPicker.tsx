
import React from 'react';

export const CATEGORY_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#78716c'
];

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
  return (
    <div className="grid grid-cols-8 gap-2">
      {CATEGORY_COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor === color ? 'border-white ring-2 ring-offset-2 ring-offset-brand-background ring-white' : 'border-transparent'}`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;