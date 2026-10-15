// app/[id]/reports/Organizer.tsx
"use client";

import { FC } from 'react';
import { useReportOrganizerData } from './_hooks/useReportOrganizerData';
import { ReportHeader } from './_components/ReportHeader';
import { StandardTable } from '@/components/ui/table/StandardTable';
import { TableRow } from '@/components/ui/table/TableRow';
import { ModalShell } from '@/components/ui/modal/ModalShell'; // 👈 Swapped in the clean structural shell
import { ColorRing } from 'react-loader-spinner';
import { IsAccessGranted } from '@/lib/Utils';
import SortListData from '@/lib/ListSort.js';

// Directly import sub-view operational content containers
// import Feedback_Container from './_components/subViews/Feedback';
// import Invite_Container from './_components/subViews/Invite';
// import Billing_Container from './_components/subViews/Billing';

interface OrganizerProps {
  companyUID: string;
}

export const Organizer: FC<OrganizerProps> = ({ companyUID }) => {
  // Inject the brain state controller
  const { state, actions } = useReportOrganizerData(companyUID);

  // 1. Loading State Guard Component
  if (state.isLoading) {
    return (
      <div className="flex w-full h-full justify-center pt-52 bg-white">
        <ColorRing 
          visible={true} 
          height="80" 
          width="80" 
          ariaLabel="blocks-loading" 
          colors={['#26C797', '#717FF6', '#D93F67', '#F0E44F', '#FCBC05']} 
        />
      </div>
    );
  }

  // 2. Organization Permissions Security Guard
  const isApproved = IsAccessGranted(state.company, state.currentUser) === 'approved';
  if (!isApproved) {
    return <div className="w-full text-center mt-40 font-semibold text-red-500">Access Status: Rejected</div>;
  }

  // 3. Pre-compute data sorting outside of the rendering frame
  const sortedTrips = SortListData(state.trips || [], state.sortSectionUID, state.sortDirection);

  // 4. Dynamic modal titling resolver based on state name
  const getModalTitle = () => {
    switch (state.selectedModalName) {
      case 'feedback': return 'Give Feedback';
      case 'invite': return 'Invite Team Members';
      case 'billing': return 'Billing & Workspace Subscription';
      default: return '';
    }
  };

  return (
    <div className="w-[calc(100%-80px)] ml-20 h-full bg-slate-50 flex flex-row relative print:w-full">
      
      {/* ========================================== */}
      {/*  REUSABLE INLINE MODAL LAYER               */}
      {/* ========================================== */}
      <ModalShell
        isOpen={Boolean(state.selectedModalName)}
        title={getModalTitle()}
        onClose={() => actions.handleModalClose?.(false)}
        maxWidth={state.selectedModalName === 'billing' ? 'xl' : state.selectedModalName === 'feedback' ? 'lg' : 'sm'}
        className="bg-slate-50/40"
        isBackOptionsShowing={state.isModalOptionsShowing}
        onBackClick={() => actions.handleModalOption?.('history', false)}
      >
        {/* {state.selectedModalName === 'feedback' && <Feedback_Container />} */}
        
        {state.selectedModalName === 'invite' && (
            <></>
        //   <Invite_Container 
        //     userInfo={state.currentUser} 
        //     company={state.company} 
        //     setRefreshUID={actions.setRefreshUID} 
        //     dbURL={state.dbURL!} 
        //   />
        )}
        
        {state.selectedModalName === 'billing' && (
            <></>
        //   <Billing_Container 
        //     userInfo={state.currentUser} 
        //     stripeInfo={state.stripeInfo} 
        //     company={state.company} 
        //     isShowingCheckout={false} 
        //     setIsShowingCheckout={() => {}} 
        //     boardUID={companyUID} 
        //     isToolTipOpen={false} 
        //     setIsToolTipOpen={() => {}} 
        //     setCurrentTooltip={actions.setCurrentTooltip || (() => {})} 
        //     handleModalOpen={actions.handleModalOpen} 
        //     handleToolTipOpen={actions.handleToolTipOpen}
        //   />
        )}
      </ModalShell>

      {/* ========================================== */}
      {/*  PRIMARY INTERFACE DASHBOARD SURFACE      */}
      {/* ========================================== */}
      <div className="grow h-full overflow-y-auto p-8 print:w-full">
        {/* Dynamic header row targeting dates, export interactions, and filters */}
        <ReportHeader state={state} actions={actions} />
        
        <div className="mt-6">
          <StandardTable 
            name="reports" 
            data={state.trips || []} 
            columns={state.activeHeaders} 
            companyInfo={state.company}
          >
            {sortedTrips.map((tripItem: any, index: number) => (
              <TableRow 
                key={tripItem.id || index}
                index={index}
                name="reports"
                item={tripItem}
                allClients={state.clients}
                allEmployees={state.drivers}
                headerTitles={state.activeHeaders}
                onPress={(idx, data) => {
                  console.log(`Row action pressed at index ${idx}`, data);
                }}
              />
            ))}
          </StandardTable>
        </div>
      </div>
    </div>
  );
};

export default Organizer;