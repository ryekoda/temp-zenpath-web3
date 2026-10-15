import * as React from 'react';
// import Organizer from './Organizer';
import Organizer from './OldOrganizer';
import Restriction from '@/components/ui/Restriction';

interface Props {
  // We use standard Promise typing for modern Next.js asynchronous route parameters
  params: Promise<{ id: string }>
}

const Reports = async ({ params }: Props) => {  
  // 1. Await the parameters token cleanly so your id is 100% stable before rendering
  const { id } = await params;

  // 2. Early safety boundary guard
  if (!id) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-white text-black'>
        <p className='text-sm animate-pulse'>Loading organization matrix...</p>
      </div>
    );
  }

  return (
    <div className='h-screen overflow-hidden print:overflow-visible'>
      <div className='h-full hidden sm:block'>
        {/* 3. The companyUID is now guaranteed to be a solid string token */}
        <Organizer companyUID={ id }/>
      </div>

      <div className='h-full block sm:hidden'>
        <Restriction/>
      </div>
    </div>
  );
}

export default Reports;