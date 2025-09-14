import React, { useState } from 'react';
import { ChevronRight, User, GraduationCap } from 'lucide-react';
import { UserInfo } from '../types';

interface UserInfoPageProps {
  onNext: (userInfo: UserInfo) => void;
}

const scientificFields = [
  'Biology',
  'Chemistry', 
  'Physics',
  'Biochemistry',
  'Medical/Medicine',
  'Psychology',
  'Environmental Science',
  'Computer Science',
  'Mathematics',
  'Engineering',
  'Neuroscience',
  'Genetics',
  'Pharmacology',
  'Other'
];

export const UserInfoPage: React.FC<UserInfoPageProps> = ({ onNext }) => {
  const [age, setAge] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState<string>('');
  const [customField, setCustomField] = useState<string>('');
  const [errors, setErrors] = useState<{ age?: string; fieldOfStudy?: string }>({});

  const validateForm = () => {
    const newErrors: { age?: string; fieldOfStudy?: string } = {};
    
    if (!age || isNaN(Number(age)) || Number(age) < 18 || Number(age) > 100) {
      newErrors.age = 'Please enter a valid age between 18 and 100';
    }
    
    const finalField = fieldOfStudy === 'Other' ? customField : fieldOfStudy;
    if (!finalField.trim()) {
      newErrors.fieldOfStudy = 'Please select or enter your field of study';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const finalField = fieldOfStudy === 'Other' ? customField : fieldOfStudy;
      onNext({
        age: Number(age),
        fieldOfStudy: finalField
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                CRediT Icon Survey
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Help us choose the most intuitive icons for scientific contributions
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">User Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">Learn CRediT</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Survey</span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tell Us About Yourself
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              This information helps us understand our survey participants and improve our research.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age Input */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                What is your age? *
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your age"
                min="18"
                max="100"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>

            {/* Field of Study */}
            <div>
              <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                What is your field of study in science? *
              </label>
              <select
                id="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your field of study</option>
                {scientificFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              {errors.fieldOfStudy && (
                <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
              )}
            </div>

            {/* Custom Field Input */}
            {fieldOfStudy === 'Other' && (
              <div>
                <label htmlFor="customField" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify your field of study *
                </label>
                <input
                  type="text"
                  id="customField"
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your field of study"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
              >
                <span>Continue to CRediT Overview</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            Your information is collected for research purposes only and will be kept confidential.
          </p>
        </div>
      </div>
    </div>
  );
};