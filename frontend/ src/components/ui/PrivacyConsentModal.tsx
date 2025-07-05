 import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users, Clock, Eye } from "lucide-react";

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onConsent: (settings: any) => void;
}

const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({ isOpen, onConsent }) => {
  const [isMinor, setIsMinor] = useState<boolean | null>(null);
  const [dataConsent, setDataConsent] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [functionalConsent, setFunctionalConsent] = useState(false);

  const handleSubmit = () => {
    if (isMinor && !parentalConsent) {
      alert('Parental consent is required for users under 13 years old (COPPA compliance)');
      return;
    }
    if (!dataConsent) {
      alert('Data processing consent is required to use this application (GDPR compliance)');
      return;
    }

    onConsent({
      isMinor,
      dataProcessingConsent: dataConsent,
      parentalConsent: isMinor ? parentalConsent : false,
      functionalCookiesConsent: functionalConsent
    });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Data Protection</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-4">
            <p>We respect your privacy and comply with GDPR and COPPA regulations. Please review and consent to our data practices:</p>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Age Verification (COPPA Compliance)</span>
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="age"
                      onChange={() => setIsMinor(false)}
                      className="w-4 h-4"
                    />
                    <span>I am 13 years old or older</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="age"
                      onChange={() => setIsMinor(true)}
                      className="w-4 h-4"
                    />
                    <span>I am under 13 years old</span>
                  </label>
                </div>
              </div>

              {isMinor && (
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parental-consent"
                      checked={parentalConsent}
                      onCheckedChange={(checked) => setParentalConsent(checked === true)}
                    />
                    <label htmlFor="parental-consent" className="text-sm font-medium">
                      I have verifiable parental consent to use this service (Required by COPPA)
                    </label>
                  </div>
                </div>
              )}

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Data Processing (GDPR Compliance)</span>
                </h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="data-consent"
                    checked={dataConsent}
                    onCheckedChange={(checked) => setDataConsent(checked === true)}
                  />
                  <label htmlFor="data-consent" className="text-sm">
                    I consent to the processing of my chat data for providing AI responses. Data is stored locally and can be deleted at any time.
                  </label>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Wellness Monitoring</span>
                </h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="functional-consent"
                    checked={functionalConsent}
                    onCheckedChange={(checked) => setFunctionalConsent(checked === true)}
                  />
                  <label htmlFor="functional-consent" className="text-sm">
                    I consent to usage time tracking for wellness reminders (break suggestions, sleep recommendations)
                  </label>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-2">
                <p><strong>Your Rights:</strong> You can withdraw consent, request data deletion, or access your data at any time.</p>
                <p><strong>Data Retention:</strong> Chat data is stored locally on your device and automatically deleted after 30 days of inactivity.</p>
                <p><strong>No Third-Party Sharing:</strong> Your data is never shared with third parties or used for advertising.</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            Accept & Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrivacyConsentModal;