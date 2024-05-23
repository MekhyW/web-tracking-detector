import { useState, useEffect } from 'react';
import type { SetStateAction, Dispatch } from 'react';
import browser from 'webextension-polyfill';

interface DomainMonitoringProps {
  setDomainCount: Dispatch<SetStateAction<number>>;
  setCompleted: Dispatch<SetStateAction<{
    domainMonitoring: boolean;
    localStorageDetection: boolean;
    browserHijackingDetection: boolean;
    canvasFingerprintDetection: boolean;
    cookieManagement: boolean;
  }>>;
}

const DomainMonitoring = ({ setDomainCount, setCompleted }: DomainMonitoringProps) => {
  const [domains, setDomains] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleRequest = (details: any) => {
      const url = new URL(details.url);
      setDomains(prevDomains => {
        const updatedDomains = new Set(prevDomains);
        updatedDomains.add(url.hostname);
        setDomainCount(updatedDomains.size);
        return new Set(updatedDomains);
      });
    };

    browser.webRequest.onBeforeRequest.addListener(handleRequest, { urls: ["<all_urls>"] });

    setCompleted(prev => ({ ...prev, domainMonitoring: true }));

    return () => {
      browser.webRequest.onBeforeRequest.removeListener(handleRequest);
    };
  }, [setDomainCount, setCompleted]);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">This site was accessed from these domains:</h3>
      {domains.size === 0 ? (
        <p className="text-gray-700">No domains detected yet.</p>
      ) : (
        <ul className="list-disc list-inside text-gray-700">
          {[...domains].map((domain, index) => (
            <li key={index}>{domain}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DomainMonitoring;
