import React, { useState, useEffect } from 'react';
import { RoleCard } from './RoleCard';
import { IconDisplay } from './IconDisplay';
import { creditRoles } from '../data/roles';
import { iconSet, shuffleArray } from '../data/icons';
import { CreditRole, IconItem } from '../types';
import { ArrowLeft, CheckCircle, RotateCcw, RefreshCw, Undo2 } from 'lucide-react';
import { surveyApi, type SurveyResponse as ApiSurveyResponse } from '../services/surveyApi';

interface SurveyPageProps {
  onBack: () => void;
  onComplete: () => void;
  userInfo?: {
    age: number;
    fieldOfStudy: string;
  };
  initialSurveyData?: {
    roles: CreditRole[];
    currentIconIndex: number;
    availableIcons: IconItem[];
  };
  onSurveyDataChange?: (data: {
    roles: CreditRole[];
    currentIconIndex: number;
    availableIcons: IconItem[];
  }) => void;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ 
  onBack, 
  onComplete, 
  userInfo, 
  initialSurveyData,
  onSurveyDataChange 
}) => {
  const [roles, setRoles] = useState<CreditRole[]>(
    initialSurveyData?.roles || creditRoles
  );
  const [availableIcons, setAvailableIcons] = useState<IconItem[]>(
    initialSurveyData?.availableIcons || []
  );
  const [currentIconIndex, setCurrentIconIndex] = useState(
    initialSurveyData?.currentIconIndex || 0
  );
  const [dragOverRole, setDragOverRole] = useState<number | null>(null);
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize shuffled icons on component mount
  useEffect(() => {
    if (!initialSurveyData) {
      const shuffled = shuffleArray(iconSet);
      setAvailableIcons(shuffled);
    }
    setIsLoading(false);
  }, [initialSurveyData]);

  // Save survey data whenever state changes
  useEffect(() => {
    if (onSurveyDataChange && !isLoading) {
      onSurveyDataChange({
        roles,
        currentIconIndex,
        availableIcons
      });
    }
  }, [roles, currentIconIndex, availableIcons, onSurveyDataChange, isLoading]);

  const currentIcon = currentIconIndex < availableIcons.length ? availableIcons[currentIconIndex] : null;
  const assignedRoles = roles.filter(role => role.assignedIcon).length;
  const progressPercentage = (assignedRoles / roles.length) * 100;

  const handleDragStart = (iconId: string) => {
    setDraggingIcon(iconId);
  };

  const handleDragOver = (roleId: number, isOver: boolean) => {
    setDragOverRole(isOver ? roleId : null);
  };

  const handleDrop = (roleId: number, iconId: string) => {
    // Find the icon being dropped
    const droppedIcon = availableIcons.find(icon => icon.id === iconId);
    if (!droppedIcon) return;

    // Update roles with the new assignment
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return { ...role, assignedIcon: droppedIcon.name };
      }
      // Remove icon from any other role that might have it
      if (role.assignedIcon === droppedIcon.name) {
        return { ...role, assignedIcon: undefined };
      }
      return role;
    }));

    // Move to next icon if current one was placed
    if (currentIcon && currentIcon.id === iconId) {
      setCurrentIconIndex(prev => prev + 1);
    }

    setDraggingIcon(null);
    setDragOverRole(null);
  };

  const handleSubmit = () => {
    const unassignedRoles = roles.filter(role => !role.assignedIcon);
    if (unassignedRoles.length > 0) {
      alert(`Please assign icons to all roles. ${unassignedRoles.length} roles still need icons.`);
      return;
    }
    
    // Submit to backend
    submitSurveyToBackend();
  };

  const submitSurveyToBackend = async () => {
    if (!userInfo) {
      alert('User information is missing. Please restart the survey.');
      return;
    }

    try {
      // Prepare survey data for API
      const responses: ApiSurveyResponse[] = roles
        .filter(role => role.assignedIcon)
        .map((role, index) => ({
          role_title: role.title,
          assigned_icon: role.assignedIcon!,
          response_order: index
        }));

      const submissionData = {
        participant: {
          age: userInfo.age,
          field_of_study: userInfo.fieldOfStudy
        },
        responses,
        survey_version: '1.0'
      };

      // Show loading state
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      // Submit to API
      const result = await surveyApi.submitSurvey(submissionData);
      
      if (result.success) {
        console.log('Survey submitted successfully:', result.data);
        onComplete();
      } else {
        throw new Error(result.error || 'Failed to submit survey');
      }

    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again or contact support.');
      
      // Reset button state
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Survey';
      }
    }
  };

  const handleReset = () => {
    setRoles(creditRoles);
    setCurrentIconIndex(0);
    const shuffled = shuffleArray(iconSet);
    setAvailableIcons(shuffled);
  };

  // Handle drag start from assigned icons (for reordering)
  const handleAssignedIconDragStart = (e: React.DragEvent, roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.assignedIcon) {
      e.dataTransfer.setData('text/plain', `assigned:${role.assignedIcon}`);
      e.dataTransfer.setData('application/json', JSON.stringify({ 
        type: 'assigned', 
        iconName: role.assignedIcon, 
        sourceRoleId: roleId 
      }));
      setDraggingIcon(role.assignedIcon);
    }
  };

  // Enhanced drop handler for both new icons and reordering
  const handleEnhancedDrop = (roleId: number, dragData: string) => {
    try {
      // Try to parse as JSON first (for assigned icon reordering)
      const parsedData = JSON.parse(dragData);
      if (parsedData.type === 'assigned') {
        // Handle reordering of assigned icons
        const sourceRoleId = parsedData.sourceRoleId;
        const targetRole = roles.find(r => r.id === roleId);
        const sourceRole = roles.find(r => r.id === sourceRoleId);
        
        if (sourceRole && targetRole && sourceRoleId !== roleId) {
          // Swap the icons between roles
          setRoles(prev => prev.map(role => {
            if (role.id === sourceRoleId) {
              return { ...role, assignedIcon: targetRole.assignedIcon };
            } else if (role.id === roleId) {
              return { ...role, assignedIcon: sourceRole.assignedIcon };
            }
            return role;
          }));
        }
        return;
      }
    } catch {
      // If JSON parsing fails, treat as regular icon ID (new assignment)
      const iconId = dragData.replace('assigned:', '');
      
      // Find the icon being dropped
      const droppedIcon = availableIcons.find(icon => icon.id === iconId);
      if (!droppedIcon) return;

      // Update roles with the new assignment
      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          return { ...role, assignedIcon: droppedIcon.name };
        }
        // Remove icon from any other role that might have it
        if (role.assignedIcon === droppedIcon.name) {
          return { ...role, assignedIcon: undefined };
        }
        return role;
      }));

      // Move to next icon if current one was placed
      if (currentIcon && currentIcon.id === iconId) {
        setCurrentIconIndex(prev => prev + 1);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">User Info</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Learn CRediT</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Survey</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to CRediT Overview</span>
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900">
              CRediT Icon Survey
            </h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Roles Assigned: {assignedRoles} of {roles.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Icon Display - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* User Info Display */}
              {userInfo && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Participant Info</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Age: {userInfo.age}</p>
                    <p>Field: {userInfo.fieldOfStudy}</p>
                  </div>
                </div>
              )}

              {currentIcon ? (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                  <IconDisplay
                    icon={currentIcon}
                    onDragStart={handleDragStart}
                    isDragging={draggingIcon === currentIcon.id}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      All Icons Placed!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Review your assignments and submit when ready
                    </p>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className={`
                  w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg
                  transition-all duration-200 transform
                  ${assignedRoles === roles.length
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
                disabled={assignedRoles !== roles.length}
              >
                <CheckCircle className="w-5 h-5" />
                <span>Submit Survey</span>
              </button>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              CRediT Roles - Drag Icons to Match or Reorder
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>💡 How to use:</strong> Drag new icons from the left panel to assign them to roles. 
                Once assigned, you can drag icons between roles to reorder them.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onDrop={handleEnhancedDrop}
                  isDragOver={dragOverRole === role.id}
                  onDragOver={handleDragOver}
                  onAssignedIconDragStart={handleAssignedIconDragStart}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};