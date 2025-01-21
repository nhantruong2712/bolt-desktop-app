import * as RadixDialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useState, type ReactElement } from 'react';
import { classNames } from '~/utils/classNames';
import { DialogTitle, dialogVariants, dialogBackdropVariants } from '~/components/ui/Dialog';
import { IconButton } from '~/components/ui/IconButton';
import styles from './Settings.module.scss';
import ProvidersTab from './providers/ProvidersTab';
import { useSettings } from '~/lib/hooks/useSettings';
import FeaturesTab from './features/FeaturesTab';
import DebugTab from './debug/DebugTab';
import EventLogsTab from './event-logs/EventLogsTab';
import ConnectionsTab from './connections/ConnectionsTab';
import DataTab from './data/DataTab';
import { Database, Key, Link, Star } from 'react-feather';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'data' | 'providers' | 'features' | 'debug' | 'event-logs' | 'connection';

export const SettingsWindow = ({ open, onClose }: SettingsProps) => {
  const { debug, eventLogs } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('data');

  const tabs: { id: TabType; label: string; icon: ReactElement | string; component?: ReactElement }[] = [
    { id: 'data', label: 'Data', icon: <Database size={14} />, component: <DataTab /> },
    { id: 'providers', label: 'Providers', icon: <Key size={14} />, component: <ProvidersTab /> },
    { id: 'connection', label: 'Connection', icon: <Link size={14} />, component: <ConnectionsTab /> },
    { id: 'features', label: 'Features', icon: <Star size={14} />, component: <FeaturesTab /> },
    ...(debug
      ? [
          {
            id: 'debug' as TabType,
            label: 'Debug Tab',
            icon: 'i-ph:bug',
            component: <DebugTab />,
          },
        ]
      : []),
    ...(eventLogs
      ? [
          {
            id: 'event-logs' as TabType,
            label: 'Event Logs',
            icon: 'i-ph:list-bullets',
            component: <EventLogsTab />,
          },
        ]
      : []),
  ];

  return (
    <RadixDialog.Root open={open}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay asChild onClick={onClose}>
          <motion.div
            className="bg-black/50 fixed inset-0 z-max backdrop-blur-sm"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dialogBackdropVariants}
          />
        </RadixDialog.Overlay>
        <RadixDialog.Content aria-describedby={undefined} asChild>
          <motion.div
            className="fixed top-[50%] left-[50%] z-max h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] border border-bolt-elements-borderColor rounded-lg shadow-lg focus:outline-none overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dialogVariants}
          >
            <div className="flex h-full">
              <div
                className={classNames(
                  'w-48 border-r border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4 flex flex-col justify-between',
                  styles['settings-tabs'],
                )}
              >
                <DialogTitle className="flex-shrink-0 text-lg font-semibold text-bolt-elements-textPrimary mb-2">
                  Settings
                </DialogTitle>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={classNames(activeTab === tab.id ? styles.active : '')}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                <div className="mt-auto flex flex-col gap-2"></div>
              </div>

              <div className="flex-1 flex flex-col p-8 pt-10 bg-bolt-elements-background-depth-2">
                <div className="flex-1 overflow-y-auto">{tabs.find((tab) => tab.id === activeTab)?.component}</div>
              </div>
            </div>
            <RadixDialog.Close asChild onClick={onClose}>
              <IconButton icon="i-ph:x" className="absolute top-[10px] right-[10px]" />
            </RadixDialog.Close>
          </motion.div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
