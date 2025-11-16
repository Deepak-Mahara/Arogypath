import React from 'react';
import './PageStyles.css'; // Reuse the same styles

const ContactPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Contact Us</h1>
        <p>
          We would love to hear from you! Whether you have a question about our services, feedback on our application, or a partnership inquiry, please feel free to reach out.
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:support@arogyapath.com">support@arogyapath.com</a>
        </p>
        <p>
          Our team will get back to you as soon as possible.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;