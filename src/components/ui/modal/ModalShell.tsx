'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@/components/ui/Button';
import { cn, CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';

interface ModalShellProps {
  isOpen: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  title: string;
  maxWidth?: DialogProps['maxWidth']; // Allows 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isBackOptionsShowing?: boolean;
  onBackClick?: () => void;
  children: React.ReactNode; // This lets you inject ANY layout/style inside
  className?: string; // For completely customizing the internal content background/padding
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = 'sm', // Defaults to small if you don't provide one
  isBackOptionsShowing = false,
  onBackClick,
  children,
  className,
}) => {
  const descriptionElementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => onClose(false)} 
      scroll="paper" 
      aria-labelledby="global-dialog-title" 
      aria-describedby="global-dialog-description" 
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        className: "rounded-xl border border-slate-100 shadow-xl"
      }}
    >
      {/* Structural Header Section */}
      <DialogTitle className="flex flex-row items-center justify-between p-5 border-b border-slate-100" id="global-dialog-title">
        <div className="flex items-center gap-2">
          {isBackOptionsShowing && onBackClick && (
            <Button 
              variant="ghost" 
              onClick={onBackClick} 
              className="p-1.5 hover:bg-slate-50 mr-2"
            >
              <Image src="/images/ArrowRight.png" alt="Back" width={14} height={14} className="rotate-180" />
            </Button>
          )}
          <span className="text-lg font-bold text-slate-800">
            {CapitalizeFirstLetterOfEachWord(title)}
          </span>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => onClose(false)} 
          className="p-1.5 hover:bg-slate-50 ml-auto rounded-md transition-colors"
        >
          <Image src="/images/close.png" alt="Close" width={12} height={12} />
        </Button>
      </DialogTitle>

      {/* Structural Injectable Content Shell */}
      <DialogContent className={cn("p-6", className)}>
        <DialogContentText id="global-dialog-description" ref={descriptionElementRef} tabIndex={-1} component={"div" as any}>
          {children}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default ModalShell;