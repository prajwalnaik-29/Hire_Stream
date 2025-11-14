import React from 'react';
import { RxCross2 } from 'react-icons/rx';

const ModalChatbot = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-50 rounded-xl p-6 relative shadow-lg mt-20 animate-bounceIn">
        <RxCross2
          onClick={onClose}
          className="absolute right-2 top-2 text-xl cursor-pointer text-gray-500 hover:text-black"
        ></RxCross2>
        {children}
      </div>
    </div>
  );
};

export default ModalChatbot;
