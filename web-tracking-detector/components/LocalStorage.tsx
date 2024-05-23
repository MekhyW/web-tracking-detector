import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface LocalStorageDetectionProps {
  setHasLocalStorage: Dispatch<SetStateAction<boolean>>;
  setCompleted: Dispatch<SetStateAction<{
    domainMonitoring: boolean;
    localStorageDetection: boolean;
    browserHijackingDetection: boolean;
    canvasFingerprintDetection: boolean;
    cookieManagement: boolean;
  }>>;
}

const LocalStorageDetection = ({ setHasLocalStorage, setCompleted }: LocalStorageDetectionProps) => {
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const detectLocalStorage = () => {
      const hasLocalStorage = localStorage.length > 0;
      setDetected(hasLocalStorage);
      setHasLocalStorage(hasLocalStorage);
    };

    detectLocalStorage();

    // Signal completion
    setCompleted(prev => ({ ...prev, localStorageDetection: true }));
  }, [setHasLocalStorage, setCompleted]);

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Local Storage Detection</h3>
      <p className="text-gray-700">Local storage detected: {detected ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default LocalStorageDetection;
