 import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Target, Lightbulb, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuestionStorage } from '../hooks/useQuestionStorage';
import { useToast } from "@/hooks/use-toast";
import PrivacyConsentModal from './PrivacyConsentModal';
import PrivacySettingsPanel from './PrivacySettingsPanel';
import { usePrivacyCompliance } from '../hooks/usePrivacyCompliance';
import { useWellnessMonitoring } from '../hooks/useWellnessMonitoring';
import { Settings } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm PrepGPT, your AI study companion. I'm here to help you with studying, homework, test preparation, and academic success. Your questions can be saved for future reference. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { saveQuestion, clearAllQuestions } = useQuestionStorage();
  const { toast } = useToast();
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const { privacySettings, showConsentModal, updateConsent, revokeConsent, setShowConsentModal } = usePrivacyCompliance();
  const { wellnessState, resetSession } = useWellnessMonitoring();

  const handleSendMessage = (messageText: string) => {
    // Check if user has given consent before processing
    if (!privacySettings.dataProcessingConsent) {
      setShowConsentModal(true);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
     
fetch("http://127.0.0.1:8000/api/chat/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: messageText }),
})
  .then((res) => res.json())
  .then((data) => {
    const aiResponse: Message = {
      id: Date.now().toString(),
      text: data.reply || "Sorry, I couldn't generate a response.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, aiResponse]);
  })
  .catch((err) => {
    console.error("API error:", err);
  });



  const handleSaveQuestion = (questionId: string) => {
    const messageIndex = messages.findIndex(m => m.id === questionId);
    if (messageIndex !== -1 && messages[messageIndex].isUser) {
      const question = messages[messageIndex].text;
      const answerIndex = messageIndex + 1;
      const answer = answerIndex < messages.length ? messages[answerIndex].text : '';
      
      saveQuestion(question, answer);
      toast({
        title: "Question Saved",
        description: "Your question and answer have been saved for future reference.",
      });
    }
  };

  const handleDeleteData = () => {
    clearAllQuestions();
    localStorage.removeItem('privacy-consent');
    localStorage.removeItem('wellness-state');
    localStorage.removeItem('wellness-date');
    setMessages([{
      id: '1',
      text: "Welcome to PrepGPT! I'm your AI study companion. How can I help you study today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setShowPrivacySettings(false);
  };

  const handleRevokeConsent = () => {
    revokeConsent();
    handleDeleteData();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (showPrivacySettings) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-4">
          <Button
            onClick={() => setShowPrivacySettings(false)}
            variant="outline"
          >
            ← Back to Chat
          </Button>
        </div>
        <PrivacySettingsPanel
          onRevokeConsent={handleRevokeConsent}
          onDeleteData={handleDeleteData}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-h-screen">
      <PrivacyConsentModal
        isOpen={showConsentModal}
        onConsent={updateConsent}
      />
      
      {/* Features Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2 text-blue-700">
              <BookOpen className="w-4 h-4" />
              <span>Study Help</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Target className="w-4 h-4" />
              <span>Test Prep</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Lightbulb className="w-4 h-4" />
              <span>Concept Explanation</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Clock className="w-4 h-4" />
              <span>Study Planning</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Save className="w-4 h-4" />
              <span>Question Storage</span>
            </div>
          </div>
          <Button
            onClick={() => setShowPrivacySettings(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Privacy Settings</span>
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={message.id} className="relative group">
              <MessageBubble
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
              {message.isUser && (
                <Button
                  onClick={() => handleSaveQuestion(message.id)}
                  size="sm"
                  variant="outline"
                  className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600"
                >
                  <Save className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface
