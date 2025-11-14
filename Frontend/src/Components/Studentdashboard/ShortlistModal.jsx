import React, { useState } from 'react';
import { CheckCircle, Bell, X } from 'lucide-react';

export default function ShortlistModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-green-500 rounded-full p-4">
                <CheckCircle size={48} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Congratulations! 🎉
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your application has been{' '}
            <span className="font-semibold text-green-600">shortlisted</span>!
            Keep an eye on your notifications—your interview may be scheduled
            soon.
          </p>

          {/* Bell icon with notification */}
          <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-4 mb-6">
            <Bell className="text-blue-600" size={20} />
            <span className="text-sm text-blue-800 font-medium">
              Stay tuned for updates
            </span>
          </div>

          {/* Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
