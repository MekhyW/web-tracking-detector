import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface BrowserHijackingDetectionProps {
  setHasHijacking: Dispatch<SetStateAction<boolean>>;
  setCompleted: Dispatch<SetStateAction<{
    domainMonitoring: boolean;
    localStorageDetection: boolean;
    browserHijackingDetection: boolean;
    canvasFingerprintDetection: boolean;
    cookieManagement: boolean;
  }>>;
}

const BrowserHijackingDetection = ({ setHasHijacking, setCompleted }: BrowserHijackingDetectionProps) => {
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const hijackingPatterns = ["eval", "document.write", "innerHTML"];

    const checkHijacking = () => {
      const detected = hijackingPatterns.some(pattern =>
        document.documentElement.innerHTML.includes(pattern)
      );
      setDetected(detected);
      setHasHijacking(detected);
    };

    checkHijacking();

    // Signal completion
    setCompleted(prev => ({ ...prev, browserHijackingDetection: true }));
  }, [setHasHijacking, setCompleted]);

  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
      <p className="text-sm text-gray-700">Browser hijacking detected: <span className={detected ? 'text-red-600' : 'text-green-600'}>{detected ? 'Yes' : 'No'}</span></p>
    </div>
  );
};

export default BrowserHijackingDetection;
