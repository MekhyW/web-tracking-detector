import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import browser from 'webextension-polyfill';

interface CookieManagementProps {
  setCookieCount: Dispatch<SetStateAction<number>>;
  setCompleted: Dispatch<SetStateAction<{
    domainMonitoring: boolean;
    localStorageDetection: boolean;
    browserHijackingDetection: boolean;
    canvasFingerprintDetection: boolean;
    cookieManagement: boolean;
  }>>;
}

const CookieManagement = ({ setCookieCount, setCompleted }: CookieManagementProps) => {
  const [firstPartyCookies, setFirstPartyCookies] = useState(0);
  const [thirdPartyCookies, setThirdPartyCookies] = useState(0);

  useEffect(() => {
    const getCookies = async () => {
      const allCookies = await browser.cookies.getAll({});
      const firstParty = allCookies.filter(cookie => {
        return cookie.domain.includes(window.location.hostname);
      }).length;
      const thirdParty = allCookies.length - firstParty;

      setFirstPartyCookies(firstParty);
      setThirdPartyCookies(thirdParty);
      setCookieCount(allCookies.length);
      setCompleted(prev => ({ ...prev, cookieManagement: true }));
    };

    getCookies();
  }, [setCookieCount, setCompleted]);

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg">
      <p className="text-sm text-gray-700">First-party cookies: <span className="font-bold">{firstPartyCookies}</span></p>
      <p className="text-sm text-gray-700">Third-party cookies: <span className="font-bold">{thirdPartyCookies}</span></p>
      <p className="text-sm text-gray-700">Total cookies detected: <span className="font-bold">{firstPartyCookies + thirdPartyCookies}</span></p>
    </div>
  );
};

export default CookieManagement;
