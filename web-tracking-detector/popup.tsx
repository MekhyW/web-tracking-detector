import React, { useState, useEffect } from 'react';
import DomainMonitoring from './components/AccessedDomains';
import CookieManagement from './components/Cookies';
import LocalStorageDetection from './components/LocalStorage';
import BrowserHijackingDetection from './components/HijackingAttempts';
import CanvasFingerprintDetection from './components/CanvasFingerprintDetection';
import PrivacyScoring from './components/PrivacyClass';
import ToggleableSection from './components/Card';
import './styles/popup.css';

const Popup = () => {
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

  const checkCompletion = () => {
    return Object.values(completed).every(value => value === true);
  };

  useEffect(() => {
    if (checkCompletion()) {
      console.log('All detections are complete.');
    }
  }, [completed]);

  return (
    <div className="popup-container">
      {checkCompletion() ? (
        <PrivacyScoring
          domainCount={domainCount}
          hasLocalStorage={hasLocalStorage}
          hasHijacking={hasHijacking}
          hasFingerprinting={hasFingerprinting}
          cookieCount={cookieCount}
        />
      ) : (
        <h2 className="text-center">Total Privacy Score: Loading...</h2>
      )}
      <br></br>
      <div className="sections-container">
        <div className="section-card">
          <ToggleableSection title="Cookies 🍪">
            <p>Count and manage cookies set by websites.</p>
            <CookieManagement
              setCookieCount={setCookieCount}
              setCompleted={setCompleted}
            />
          </ToggleableSection>
        </div>
        <div className="section-card">
          <ToggleableSection title="Accessed Domains 👁️">
            <p>Monitor and count the number of domains accessed by the browser.</p>
            <DomainMonitoring
              setDomainCount={setDomainCount}
              setCompleted={setCompleted}
            />
          </ToggleableSection>
        </div>
        <div className="section-card">
          <ToggleableSection title="Local Storage 📦">
            <p>Detect if local storage is being used by websites.</p>
            <LocalStorageDetection
              setHasLocalStorage={setHasLocalStorage}
              setCompleted={setCompleted}
            />
          </ToggleableSection>
        </div>
        <div className="section-card">
          <ToggleableSection title="Hijacking Attempts 🕵️">
            <p>Detect any attempts to hijack the browser's functionality.</p>
            <BrowserHijackingDetection
              setHasHijacking={setHasHijacking}
              setCompleted={setCompleted}
            />
          </ToggleableSection>
        </div>
        <div className="section-card">
          <ToggleableSection title="Canvas Fingerprinting 🧬">
            <p>Check if websites are trying to fingerprint your browser using canvas elements.</p>
            <CanvasFingerprintDetection
              setHasFingerprinting={setHasFingerprinting}
              setCompleted={setCompleted}
            />
          </ToggleableSection>
        </div>
      </div>
    </div>
  );
};

export default Popup;
