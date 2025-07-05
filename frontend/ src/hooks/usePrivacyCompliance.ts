import { useState, useEffect } from 'react';

interface PrivacySettings {
  dataProcessingConsent: boolean;
  functionalCookiesConsent: boolean;
  isMinor: boolean | null;
  parentalConsent: boolean;
  consentTimestamp: string | null;
}

export const usePrivacyCompliance = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataProcessingConsent: false,
    functionalCookiesConsent: false,
    isMinor: null,
    parentalConsent: false,
    consentTimestamp: null
  });
  
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('privacy-consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setPrivacySettings(parsed);
      } catch (error) {
        console.error('Error loading privacy consent:', error);
        setShowConsentModal(true);
      }
    } else {
      setShowConsentModal(true);
    }
  }, []);

  const updateConsent = (settings: Partial<PrivacySettings>) => {
    const updatedSettings = {
      ...privacySettings,
      ...settings,
      consentTimestamp: new Date().toISOString()
    };
    setPrivacySettings(updatedSettings);
    localStorage.setItem('privacy-consent', JSON.stringify(updatedSettings));
    setShowConsentModal(false);
  };

  const revokeConsent = () => {
    localStorage.removeItem('privacy-consent');
    localStorage.removeItem('prepgpt-questions');
    setPrivacySettings({
      dataProcessingConsent: false,
      functionalCookiesConsent: false,
      isMinor: null,
      parentalConsent: false,
      consentTimestamp: null
    });
    setShowConsentModal(true);
  };

  return {
    privacySettings,
    showConsentModal,
    updateConsent,
    revokeConsent,
    setShowConsentModal
  };
};