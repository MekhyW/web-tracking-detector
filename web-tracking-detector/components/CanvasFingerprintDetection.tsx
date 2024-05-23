import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface CanvasFingerprintDetectionProps {
  setHasFingerprinting: Dispatch<SetStateAction<boolean>>;
  setCompleted: Dispatch<SetStateAction<{
    domainMonitoring: boolean;
    localStorageDetection: boolean;
    browserHijackingDetection: boolean;
    canvasFingerprintDetection: boolean;
    cookieManagement: boolean;
  }>>;
}

const CanvasFingerprintDetection = ({ setHasFingerprinting, setCompleted }: CanvasFingerprintDetectionProps) => {
  const [detected, setDetected] = useState(false);

  const getCanvasFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'CANVAS_FINGERPRINT';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    return canvas.toDataURL();
  };

  useEffect(() => {
    const detectFingerprinting = () => {
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function (...args) {
        setDetected(true);
        setHasFingerprinting(true);
        return originalGetImageData.apply(this, args);
      };

      const fingerprint = getCanvasFingerprint();
      console.log('Generated Canvas Fingerprint:', fingerprint);

      // Signal completion
      setCompleted(prev => ({ ...prev, canvasFingerprintDetection: true }));

      return () => {
        CanvasRenderingContext2D.prototype.getImageData = originalGetImageData;
      };
    };

    detectFingerprinting();
  }, [setHasFingerprinting, setCompleted]);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <p className="text-sm text-gray-700">Canvas fingerprint detected: <span className={detected ? 'text-red-600' : 'text-green-600'}>{detected ? 'Yes' : 'No'}</span></p>
    </div>
  );
};

export default CanvasFingerprintDetection;
