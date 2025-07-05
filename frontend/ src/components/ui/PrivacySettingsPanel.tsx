import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Trash2, Download, Eye } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

interface PrivacySettingsPanelProps {
  onRevokeConsent: () => void;
  onDeleteData: () => void;
}

const PrivacySettingsPanel: React.FC<PrivacySettingsPanelProps> = ({ onRevokeConsent, onDeleteData }) => {
  const exportData = () => {
    const data = {
      questions: localStorage.getItem('prepgpt-questions'),
      privacyConsent: localStorage.getItem('privacy-consent'),
      wellnessData: localStorage.getItem('wellness-state'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prepgpt-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Privacy & Data Rights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={exportData}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete All Data</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your chat history, preferences, and wellness data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteData} className="bg-red-600 hover:bg-red-700">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Revoke Consent</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke Data Processing Consent</AlertDialogTitle>
                <AlertDialogDescription>
                  This will revoke your consent for data processing and delete all stored data. You'll need to provide consent again to continue using the application.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onRevokeConsent} className="bg-orange-600 hover:bg-orange-700">
                  Revoke Consent
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2 mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold">Your Privacy Rights:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure (right to be forgotten)</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsPanel;
