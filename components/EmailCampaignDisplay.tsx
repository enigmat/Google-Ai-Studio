import React, { useState } from 'react';
import Loader from './Loader';
import { EmailCampaign } from '../services/geminiService';
import TTSButton from './TTSButton';

interface EmailCampaignDisplayProps {
  campaigns: EmailCampaign[] | null;
  isLoading: boolean;
}

const EmailCampaignDisplay: React.FC<EmailCampaignDisplayProps> = ({ campaigns, isLoading }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (htmlBody: string, index: number) => {
    navigator.clipboard.writeText(htmlBody).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Failed to copy HTML: ', err);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Building your email campaign..." />
        </div>
      ) : campaigns ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-6">
          {campaigns.map((email, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="mb-4">
                <p className="text-sm text-gray-400 font-semibold">Subject: <span className="text-gray-200 font-normal">{email.subject}</span></p>
                <p className="text-sm text-gray-400 font-semibold">Preview: <span className="text-gray-200 font-normal">{email.previewText}</span></p>
              </div>
              <div className="p-4 bg-white rounded-md max-h-80 overflow-y-auto">
                 <div dangerouslySetInnerHTML={{ __html: email.body }} />
              </div>
              <div className="flex justify-end items-center mt-3 gap-2">
                 <TTSButton textToSpeak={`Subject: ${email.subject}. Preview: ${email.previewText}. Body: ${email.body}`} isHtml={true} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
                 <button onClick={() => handleCopy(email.body, index)} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors">
                    {copiedIndex === index ? 'Copied!' : 'Copy HTML'}
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <p className="mt-2 text-lg font-semibold">Your email campaigns will appear here</p>
            <p className="text-sm">Fill out the details to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCampaignDisplay;