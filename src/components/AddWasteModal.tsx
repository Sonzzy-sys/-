import React from 'react';
import { X } from 'lucide-react';
import { AddWasteForm } from './AddWasteForm';
import { WasteRecord } from '../types';

interface AddWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (record: Omit<WasteRecord, 'id' | 'timestamp'>) => void;
}

export const AddWasteModal: React.FC<AddWasteModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#FAFBF9] hover:bg-[#EAEFEA] text-[#4A6455] flex items-center justify-center transition-colors cursor-pointer border border-[#D5E3DB]"
        >
          <X className="w-4 h-4" />
        </button>
        <AddWasteForm
          isModal={true}
          onSaveRecord={(record) => {
            onSaveRecord(record);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
