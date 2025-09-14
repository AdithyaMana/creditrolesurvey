import React from 'react';
import { CreditRole } from '../types';
import { iconSet } from '../data/icons';
import { Lightbulb, Database, Search as MagnifyingGlass, Coins, Microscope, GitBranch as Workflow, User as Person, Package as Box, Code, Sigma as OrgChart, ClipboardCheck as Clipboard, BarChart3 as Chart, Pen, Edit as PenCaret } from 'lucide-react';

interface RoleCardProps {
  role: CreditRole;
  onDrop: (roleId: number, dragData: string) => void;
  isDragOver: boolean;
  onDragOver: (roleId: number, isOver: boolean) => void;
  onAssignedIconDragStart?: (e: React.DragEvent, roleId: number) => void;
}

const getIconComponent = (shape: string) => {
  switch (shape) {
    case 'lightbulb':
      return <Lightbulb className="w-6 h-6" />;
    case 'database':
      return <Database className="w-6 h-6" />;
    case 'magnifying-glass':
      return <MagnifyingGlass className="w-6 h-6" />;
    case 'coin':
      return <Coins className="w-6 h-6" />;
    case 'microscope':
      return <Microscope className="w-6 h-6" />;
    case 'workflow':
      return <Workflow className="w-6 h-6" />;
    case 'person':
      return <Person className="w-6 h-6" />;
    case 'box':
      return <Box className="w-6 h-6" />;
    case 'code':
      return <Code className="w-6 h-6" />;
    case 'org-chart':
      return <OrgChart className="w-6 h-6" />;
    case 'clipboard':
      return <Clipboard className="w-6 h-6" />;
    case 'chart':
      return <Chart className="w-6 h-6" />;
    case 'pen':
      return <Pen className="w-6 h-6" />;
    case 'pen-caret':
      return <PenCaret className="w-6 h-6" />;
    default:
      return <div className="w-6 h-6 rounded-full bg-gray-300" />;
  }
};

export const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  onDrop, 
  isDragOver, 
  onDragOver,
  onAssignedIconDragStart
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(role.id, true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(role.id, false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Get both text/plain and application/json data
    const textData = e.dataTransfer.getData('text/plain');
    const jsonData = e.dataTransfer.getData('application/json');
    
    // Pass the appropriate data to the drop handler
    onDrop(role.id, jsonData || textData);
    onDragOver(role.id, false);
  };

  const handleIconClick = () => {
    // Icon click functionality removed - now handled by drag and drop
  };

  // Find the assigned icon details
  const assignedIconData = role.assignedIcon 
    ? iconSet.find(icon => icon.name === role.assignedIcon)
    : null;

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border p-4 transition-all duration-200 hover:shadow-md
      border-gray-200
    `}>
      <div 
        className={`
          w-16 h-16 border-2 border-dashed rounded-lg mb-3 flex items-center justify-center relative
          transition-all duration-200 relative overflow-hidden
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : role.assignedIcon 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50'
          }
          ${role.assignedIcon ? 'cursor-move' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {assignedIconData ? (
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
            style={{ 
              background: `linear-gradient(135deg, ${assignedIconData.color}, ${assignedIconData.color}dd)` 
            }}
            draggable={!!role.assignedIcon}
            onDragStart={(e) => onAssignedIconDragStart?.(e, role.id)}
          >
            {getIconComponent(assignedIconData.shape)}
          </div>
        ) : isDragOver ? (
          <div className="text-blue-500 text-xs text-center px-1">
            Drop here
          </div>
        ) : (
          <div className="text-gray-400 text-xs text-center px-1">
            Drop icon here
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
        {role.title}
      </h3>
      
      <p className="text-xs text-gray-600 leading-relaxed">
        {role.description}
      </p>
    </div>
  );
};