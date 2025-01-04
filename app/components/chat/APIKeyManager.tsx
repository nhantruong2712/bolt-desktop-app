import React, { useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import type { ProviderInfo } from '~/types/model';
import { Edit2, Check, X, Key, DownloadCloud } from 'react-feather';

interface APIKeyManagerProps {
  provider: ProviderInfo;
  apiKey: string;
  setApiKey: (key: string) => void;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const APIKeyManager: React.FC<APIKeyManagerProps> = ({ provider, apiKey, setApiKey }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(tempKey);
    setIsEditing(false);
  };

  return (
    <div className="flex items-start sm:items-center mt-2 mb-2 flex-col sm:flex-row">
      <div>
        <span className="text-sm text-bolt-elements-textSecondary">{provider?.name} API Key:</span>
        {!isEditing && (
          <div className="flex items-center mb-4">
            <span className="text-xs text-bolt-elements-textPrimary mr-2">{apiKey ? '••••••••' : 'Not set'}</span>
            <IconButton onClick={() => setIsEditing(true)} title="Edit API Key">
              <Edit2 size={16} />
            </IconButton>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-3 mt-2">
          <input
            type="password"
            value={tempKey}
            placeholder="Your API Key"
            onChange={(e) => setTempKey(e.target.value)}
            className="flex-1 px-2 py-1 text-xs lg:text-sm rounded border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
          />
          <IconButton onClick={handleSave} title="Save API Key">
            <Check size={16} />
          </IconButton>
          <IconButton onClick={() => setIsEditing(false)} title="Cancel">
            <X size={16} />
          </IconButton>
        </div>
      ) : (
        <>
          {provider?.getApiKeyLink && (
            <IconButton className="ml-auto" onClick={() => window.open(provider?.getApiKeyLink)} title="Edit API Key">
              <span className="mr-2 text-xs lg:text-sm">{provider?.labelForGetApiKey || 'Get API Key'}</span>
              {provider?.icon ? <DownloadCloud size={16} /> : <Key size={16} />}
            </IconButton>
          )}
        </>
      )}
    </div>
  );
};
