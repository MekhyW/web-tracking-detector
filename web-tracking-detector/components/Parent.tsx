import React, { useState } from 'react';
import DomainMonitoring from './AccessedDomains';
import LocalStorageDetection from './LocalStorage';
import BrowserHijackingDetection from './HijackingAttempts';
import CanvasFingerprintDetection from './CanvasFingerprintDetection';
import CookieManagement from './Cookies';
import PrivacyScoring from './PrivacyClass';

const ParentComponent = () => {
  const [domainCount, setDomainCount] = useState(0);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const [hasHijacking, setHasHijacking] = useState(false);
  const [hasFingerprinting, setHasFingerprinting] = useState(false);
  const [cookieCount, setCookieCount] = useState(0);
  const [completed, setCompleted] = useState({
    domainMonitoring: false,
    localStorageDetection: false,
    browserHijackingDetection: false,
    canvasFingerprintDetection: false,
    cookieManagement: false,
  });

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Privacy Detection Components</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DomainMonitoring setDomainCount={setDomainCount} setCompleted={setCompleted} />
          <LocalStorageDetection setHasLocalStorage={setHasLocalStorage} setCompleted={setCompleted} />
          <BrowserHijackingDetection setHasHijacking={setHasHijacking} setCompleted={setCompleted} />
          <CanvasFingerprintDetection setHasFingerprinting={setHasFingerprinting} setCompleted={setCompleted} />
          <CookieManagement setCookieCount={setCookieCount} setCompleted={setCompleted} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <PrivacyScoring
          domainCount={domainCount}
          hasLocalStorage={hasLocalStorage}
          hasHijacking={hasHijacking}
          hasFingerprinting={hasFingerprinting}
          cookieCount={cookieCount}
        />
      </div>
    </div>
  );
};

export default ParentComponent;
