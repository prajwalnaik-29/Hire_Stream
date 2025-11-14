import { Outlet } from 'react-router-dom';
import StudentNavbar from './Navbar';
import StudentFooter from './Footer';
import chatbot from '../../assets/chatbot.png';
import ModalChatbot from './ModalChatbot.jsx';
import { useState } from 'react';

export default function StudentEntrypoint() {
  const [modal, setmodal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const openChat = () => {
    setIsLoading(true);
    setmodal(true);
  };

  const handleIframeLoad = () => {
    // Step 1: Wait for Botpress to write its initial data
    setTimeout(() => {
      setIsLoading(false);
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith('bp-webchat--') ||
          key.startsWith('conversations--') ||
          key.startsWith('botpress-message-history')
        ) {
          localStorage.removeItem(key);
        }
      });

      // Step 2: Force reload of iframe with fresh key
      setChatKey(Date.now());
    }, 800); // small delay to ensure Botpress initializes first
  };

  return (
    <>
      <StudentNavbar />
      <Outlet />
      <div
        onClick={openChat}
        className="w-24 h-24 fixed bottom-5 right-5 cursor-pointer"
      >
        <img src={chatbot} alt="img" className="w-full h-full object-contain" />
      </div>
      <ModalChatbot isOpen={modal} onClose={() => setmodal(false)}>
        <div className="h-[500px] w-[80vw] sm:w-[550px] relative flex flex-col ">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <div className="w-3/4 h-4 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse mb-3" />
              <div className="w-2/4 h-4 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse mb-3" />
              <div className="w-1/4 h-4 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              <p className="text-gray-500 mt-4 text-lg sm:text-2xl animate-pulse">
                Loading chatbot...
              </p>
            </div>
          )}

          <iframe
            key={openChat}
            src={`https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/11/11/03/20251111035507-CSOTMW4D.json`}
            className="w-full h-full border-none rounded-xl"
            title="HireStream"
            onLoad={handleIframeLoad}
            allow="microphone; autoplay; clipboard-write;"
          />
        </div>
      </ModalChatbot>

      <StudentFooter />
    </>
  );
}
