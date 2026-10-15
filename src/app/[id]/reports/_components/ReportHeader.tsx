'use client';

import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Input from '@/components/ui/input/Input';
import Paragraph from '@/components/ui/Paragraph';
import { Button } from '@/components/ui/Button';
import LargeHeading from '@/components/ui/LargeHeading';
import { cn } from '@/lib/Utils';
import { 
  CapitalizeFirstLetter, 
  CapitalizeFirstLetterOfEachWord, 
  FormatPhoneNumber, 
  InputOptionsConvert, 
  GetDriverNameFromUID 
} from '@/lib/GlobalFunctions';
import { NumberOfHiddenHeaders, PrintButtonPressed } from '@/app/[id]/reports/_utils/reportHeaderHelpers';

interface ReportHeaderProps {
  state: {
    company: any;
    drivers: any[];
    filterDate: Date;
    selectedDriverUID: string | undefined;
    companySettings: any;
  };
  actions: {
    setFilterDate: (date: Date) => void;
    setSelectedDriverUID: (uid: string | undefined) => void;
    handleModalOpen?: (modalName: string) => void;
    handleToolTipOpen?: (tooltipName: string, event: React.MouseEvent) => void;
  };
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ state, actions }) => {
  const { company, drivers, filterDate, selectedDriverUID, companySettings } = state;

  const handleDriverChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    actions.setSelectedDriverUID(event.target.value || undefined);
  };

  const formattedDriverOptions = (InputOptionsConvert(drivers) || []) as any[];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      {/* ========================================== */}
      {/* SCREENONLY VIEW: RENDERS ON SCREEN INTERFACE */}
      {/* ========================================== */}
      <div className="flex flex-col gap-6 print:hidden">
        {/* Top Tier: Title Metadata & Administrative Shell Context */}
        <div className="flex flex-row items-start justify-between">
          <div>
            <LargeHeading size="sm" className="text-slate-900 font-bold tracking-tight">
              Reports Dashboard
            </LargeHeading>
            <Paragraph className="text-slate-500 font-medium text-left mt-1">
              {company ? CapitalizeFirstLetterOfEachWord(company.title) : ''}
            </Paragraph>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => actions.handleModalOpen?.('feedback')} 
              className="text-slate-600 hover:bg-slate-50 gap-2"
            >
              <Image src="/images/Heart.png" width={18} height={18} alt="Feedback" />
              <span>Give feedback</span>
            </Button>

            <Button 
              variant="ghost" 
              onClick={(e) => actions.handleToolTipOpen?.('boardSettings', e)} 
              className="p-2 hover:bg-slate-50"
            >
              <Image src="/images/More.svg" width={20} height={20} alt="More options" />
            </Button>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Bottom Tier: Form Filters, Selectors, and Date Controls */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Column Layout Mask Settings Button Trigger */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Layout Columns:
              </span>
              <Button 
                variant="ghost" 
                onClick={(e) => actions.handleToolTipOpen?.('visibleHeaders', e)} 
                className="gap-2 bg-slate-50/60 hover:bg-slate-100 px-3 py-1.5 h-auto border border-slate-100"
              >
                <Image src="/images/hiddenEye.png" width={18} height={18} alt="Columns Vis" />
                <span className="text-xs text-slate-700 font-medium">
                  {NumberOfHiddenHeaders(companySettings) === 0 
                    ? 'All Visible' 
                    : `Hidden / ${NumberOfHiddenHeaders(companySettings)}`}
                </span>
              </Button>
            </div>

            {/* Live Driver Selection Dropdown Form Wrapper */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Driver:</span>
              <div className="w-[220px]">
                {formattedDriverOptions.length > 0 && (
                  <Input 
                    name="driver" 
                    frameType="dropDown" 
                    inputValue={selectedDriverUID || ''} 
                    options={formattedDriverOptions} 
                    onChange={handleDriverChange}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Temporal Frame Filtering Modules */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-0.5 rounded-lg border border-slate-200/60 shadow-inner">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                  value={dayjs(filterDate)} 
                  onChange={(date) => date && actions.setFilterDate(date.toDate())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      className: 'bg-white border-0 rounded-md max-w-[160px]',
                    }
                  }}
                />
              </LocalizationProvider>
            </div>

            <Button 
              variant="outline" 
              onClick={PrintButtonPressed} 
              className="h-[40px] px-5 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 font-medium"
            >
              Print Manifest
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PRINT-ONLY VIEW: TARGETED BY WEB ENGINE    */}
      {/* ========================================== */}
      {company && (
        <div className="hidden print:block w-full border-b-2 border-slate-900 pb-6">
          <div className="flex flex-row justify-between items-end">
            <div>
              <LargeHeading className="text-3xl font-black text-slate-900 tracking-tight">
                {CapitalizeFirstLetterOfEachWord(company.title)}
              </LargeHeading>
              <Paragraph className="text-md font-semibold text-slate-700 mt-1">
                Manifest Assignment: {CapitalizeFirstLetterOfEachWord(GetDriverNameFromUID(selectedDriverUID, drivers))}
              </Paragraph>
              <p className="text-sm text-slate-500 mt-0.5">
                Target Manifest Frame: {dayjs(filterDate).format('MMMM DD, YYYY')}
              </p>
            </div>

            {/* Target Client Dashed Contact Matrix Display Overlay Block */}
            {company.id === 'Mf21IpttifgYXMDz2Sbp' && (
              <div className="w-[320px] p-4 rounded-lg border border-dashed border-slate-400 bg-slate-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Emergency Contact Index
                </h4>
                <div className="flex flex-col gap-1.5">
                  {[...drivers]
                    .sort((a, b) => (a.fName > b.fName ? 1 : -1))
                    .map((driverInfo) => (
                      <div key={driverInfo.id} className="flex justify-between items-center text-xs text-slate-700">
                        <span className="font-medium">
                          {CapitalizeFirstLetter(driverInfo.fName)} {CapitalizeFirstLetter(driverInfo.lName)}
                        </span>
                        <span className="font-mono text-slate-600">
                          {FormatPhoneNumber(driverInfo.phone)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHeader;