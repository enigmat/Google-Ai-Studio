import React, { useState, useEffect } from 'react';
import { AirtableConfig, testAirtableConnection } from '../services/airtableService';

interface AirtableSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AirtableConfig) => void;
  currentConfig: AirtableConfig | null;
}

const AirtableSettingsModal: React.FC<AirtableSettingsModalProps> = ({ isOpen, onClose, onSave, currentConfig }) => {
  const [token, setToken] = useState('');
  const [baseId, setBaseId] = useState('');
  const [tableName, setTableName] = useState('');
  const [testState, setTestState] = useState<{ status: 'idle' | 'testing' | 'success' | 'error', message: string }>({ status: 'idle', message: '' });

  useEffect(() => {
    if (isOpen) {
        if (currentConfig) {
          setToken(currentConfig.token);
          setBaseId(currentConfig.baseId);
          setTableName(currentConfig.tableName);
        } else {
            setToken('');
            setBaseId('');
            setTableName('');
        }
        setTestState({ status: 'idle', message: '' });
    }
  }, [currentConfig, isOpen]);
  
  // Reset test status if user edits credentials
  useEffect(() => {
    setTestState({ status: 'idle', message: '' });
  }, [token, baseId, tableName]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (token.trim() && baseId.trim() && tableName.trim()) {
      onSave({ token, baseId, tableName });
    }
  };

  const handleTest = async () => {
      if (!token.trim() || !baseId.trim() || !tableName.trim()) {
          setTestState({ status: 'error', message: 'All fields are required to test.' });
          return;
      }
      setTestState({ status: 'testing', message: '' });
      try {
        await testAirtableConnection({ token, baseId, tableName });
        setTestState({ status: 'success', message: 'Connection successful!' });
      } catch (e) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setTestState({ status: 'error', message });
      }
  };

  const commonInputClasses = "w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";
  const isTesting = testState.status === 'testing';

  const TestStatusMessage = () => {
    if (testState.status === 'idle') return <div className="h-5"></div>; // Placeholder for alignment
    if (testState.status === 'testing') return null; // Spinner is shown on the button

    const colorClass = testState.status === 'success' ? 'text-green-400' : 'text-red-400';
    return (
        <p className={`text-sm ${colorClass} transition-opacity`}>
            {testState.message}
        </p>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity animate-[fade-in_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-modal-title" className="text-2xl font-bold text-indigo-400 mb-4">Airtable Settings</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 flex flex-col gap-4">
                 <div>
                    <label htmlFor="airtable-token" className="block text-sm font-semibold text-gray-400 mb-1">Personal Access Token</label>
                    <input id="airtable-token" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="pat..." className={commonInputClasses} />
                </div>
                 <div>
                    <label htmlFor="airtable-base-id" className="block text-sm font-semibold text-gray-400 mb-1">Base ID</label>
                    <input id="airtable-base-id" type="text" value={baseId} onChange={(e) => setBaseId(e.target.value)} placeholder="app..." className={commonInputClasses} />
                </div>
                 <div>
                    <label htmlFor="airtable-table-name" className="block text-sm font-semibold text-gray-400 mb-1">Table Name</label>
                    <input id="airtable-table-name" type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="e.g., AI Images" className={commonInputClasses} />
                </div>
            </div>
            <div className="md:w-1/2 bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-sm">
                <h3 className="font-semibold text-gray-300 mb-2">Setup Instructions</h3>
                <ol className="list-decimal list-inside text-gray-400 space-y-2">
                    <li>Create a table in your Airtable base.</li>
                    <li>Add the following fields (case-sensitive):
                        <ul className="list-disc list-inside ml-4 mt-1 text-xs font-mono bg-gray-800 p-2 rounded">
                            <li>Title (Single line text)</li>
                            <li>Description (Long text)</li>
                            <li>Prompt (Long text)</li>
                            <li>Original Prompt (Long text, optional)</li>
                            <li>Tags (Single line text)</li>
                            <li>ImageUrl (Long text)</li>
                        </ul>
                    </li>
                    <li>Go to your <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">developer hub</a> to create a Personal Access Token with `data.records:write` scope for your base.</li>
                     <li>Find your Base ID at <a href="https://airtable.com/api" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">airtable.com/api</a>.</li>
                </ol>
                <p className="text-xs text-gray-400 mt-2">
                    The 'Prompt' field stores the final prompt (including enhancements). 'Original Prompt' saves the prompt before you used "Enhance Prompt".
                </p>
                <p className="text-xs text-gray-500 mt-3">* Your credentials are stored only in your browser's local storage.</p>
            </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
            <TestStatusMessage />
            <div className="flex justify-end gap-4">
                 <button
                    type="button"
                    onClick={handleTest}
                    disabled={isTesting || !token.trim() || !baseId.trim() || !tableName.trim()}
                    className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-colors disabled:bg-sky-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isTesting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Testing...
                        </>
                    ) : 'Test Connection'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!token.trim() || !baseId.trim() || !tableName.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Save Settings
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AirtableSettingsModal;