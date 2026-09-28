import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { sounds } from '../game/audio';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ isOpen, onClose, onConfirmExit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-md bg-[#0e1014] border-4 border-black shadow-[10px_14px_0px_#000000] p-6 text-left flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#ef4444] text-white font-display font-black text-xs px-2 py-0.5 uppercase border border-black shadow-[2px_2px_0px_#000]">
              ABORT
            </div>
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              Exit Simulation Protocol?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onClose();
            }}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-mono text-neutral-300 leading-relaxed">
          Are you sure you want to disengage? Active sector telemetry and operative assignments will be returned to standby mode.
        </p>

        <div className="pt-2 border-t-2 border-neutral-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onClose();
            }}
            className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border-2 border-black text-neutral-300 font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Cancel [ESC]
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onConfirmExit();
            }}
            className="py-2.5 px-5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            Exit To Standby
          </button>
        </div>
      </div>
    </div>
  );
};
