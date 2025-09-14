import React from 'react';
import { IconItem } from '../types';
import { Lightbulb, Database, Search as MagnifyingGlass, Coins, Microscope, GitBranch as Workflow, User as Person, Package as Box, Code, Sigma as OrgChart, ClipboardCheck as Clipboard, BarChart3 as Chart, Pen, Edit as PenCaret } from 'lucide-react';

interface IconDisplayProps {
  icon: IconItem | null;
  onDragStart: (iconId: string) => void;
  isDragging: boolean;
}

const IconShape: React.FC<{ icon: IconItem; size?: string }> = ({ icon, size = "w-12 h-12" }) => {
  const baseClasses = `${size} flex items-center justify-center text-white font-bold text-lg transition-all duration-200`;
  
  const getShapeComponent = () => {
    switch (icon.shape) {
      case 'lightbulb':
        return <Lightbulb className="w-8 h-8" />;
      case 'database':
        return <Database className="w-8 h-8" />;
      case 'magnifying-glass':
        return <MagnifyingGlass className="w-8 h-8" />;
      case 'coin':
        return <Coins className="w-8 h-8" />;
      case 'microscope':
        return <Microscope className="w-8 h-8" />;
      case 'workflow':
        return <Workflow className="w-8 h-8" />;
      case 'person':
        return <Person className="w-8 h-8" />;
      case 'box':
        return <Box className="w-8 h-8" />;
      case 'code':
        return <Code className="w-8 h-8" />;
      case 'org-chart':
        return <OrgChart className="w-8 h-8" />;
      case 'clipboard':
        return <Clipboard className="w-8 h-8" />;
      case 'chart':
        return <Chart className="w-8 h-8" />;
      case 'pen':
        return <Pen className="w-8 h-8" />;
      case 'pen-caret':
        return <PenCaret className="w-8 h-8" />;
      default:
        return <div className="w-8 h-8 rounded-full bg-white/30" />;
    }
  };

  return (
    <div 
      className={`${baseClasses} rounded-lg`}
      style={{ background: `linear-gradient(135deg, ${icon.color}, ${icon.color}dd)` }}
    >
      {getShapeComponent()}
    </div>
  );
};

export const IconDisplay: React.FC<IconDisplayProps> = ({ 
  icon, 
  onDragStart, 
  isDragging 
}) => {
  if (!icon) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-lg font-medium">All icons placed!</p>
        <p className="text-sm">Ready to submit your survey</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', icon.id);
    onDragStart(icon.id);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Current Icon
        </h3>
        <p className="text-sm text-gray-600">
          Drag this icon to match it with a role
        </p>
      </div>
      
      <div 
        className={`
          cursor-move transition-all duration-200 p-6 bg-white rounded-xl shadow-lg
          border-2 border-gray-200 hover:shadow-xl hover:scale-105
          ${isDragging ? 'opacity-50 rotate-3 scale-110' : 'opacity-100'}
        `}
        draggable
        onDragStart={handleDragStart}
      >
        <IconShape icon={icon} size="w-20 h-20" />
      </div>
      
      <div className="text-xs text-gray-500 text-center max-w-48">
        Click and drag the icon above to the matching role description on the left
      </div>
    </div>
  );
};