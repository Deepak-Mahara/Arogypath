import React from 'react';
import './PageStyles.css'; // We'll create a shared style file

const AboutPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>About ArogyaPath</h1>
        <p>
          ArogyaPath is dedicated to bringing the timeless wisdom of Ayurveda into the modern world. Our mission is to empower individuals to achieve holistic health and balance through personalized, accessible, and authentic wellness tools.
        </p>
        <p>
          We believe that the path to wellness is unique for everyone. By leveraging technology to provide tailored dietary recommendations and visual wellness assessments, we aim to make the profound principles of Ayurveda a practical part of your daily life.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;