import React from 'react';
import './WhatsAppButton.css'; // For animation and positioning

interface WhatsAppButtonProps {
  phoneNumber: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber }) => {
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Chat on WhatsApp"
    >
      <img src="/whatsapp-svgrepo-com.svg" alt="WhatsApp" className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppButton;