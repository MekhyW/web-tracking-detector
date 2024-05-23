import { useState, useEffect } from 'react';

const PrivacyScoring = ({ domainCount, hasLocalStorage, hasHijacking, hasFingerprinting, cookieCount }) => {
  const [score, setScore] = useState(100);

  useEffect(() => {
    const calculateScore = () => {
      let currentScore = 100;
      if (domainCount > 1) currentScore -= 20;
      if (hasLocalStorage) currentScore -= 15;
      if (hasHijacking) currentScore -= 20;
      if (hasFingerprinting) currentScore -= 15;
      if (cookieCount > 0) currentScore -= 10;
      setScore(currentScore < 0 ? 0 : currentScore);
    };

    calculateScore();
  }, [cookieCount, hasLocalStorage, hasHijacking, hasFingerprinting, domainCount]);

  const getPrivacyRating = () => {
    if (score >= 80) {
      return 'High';
    } else if (score >= 60) {
      return 'Medium';
    } else if (score >= 40) {
      return 'Low';
    } else {
      return 'Very Low';
    }
  };

  const getPrivacyColor = () => {
    if (score >= 80) {
      return 'text-green-600';
    } else if (score >= 60) {
      return 'text-yellow-600';
    } else if (score >= 40) {
      return 'text-orange-600';
    } else {
      return 'text-red-600';
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-2 text-center">Privacy Class:</h1>
        <div className={`${getPrivacyColor()} text-center`}>
          <h2 className="text-2xl font-semibold">{getPrivacyRating()}</h2>
        </div>
      <p className="text-sm text-center" text-center> (score for this website: {score}%)</p>
    </div>
  );
};

export default PrivacyScoring;
