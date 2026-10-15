// 'use client';

// import React from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { ModalShell } from './ModalShell';

// // Import your sub-views once globally
// import Feedback_Container from '@/app/[id]/reports/_components/subViews/Feedback';
// import Invite_Container from '@/app/[id]/reports/_components/subViews/Invite';
// import Billing_Container from '@/app/[id]/reports/_components/subViews/Billing';

// interface GlobalModalManagerProps {
//   companyUID: string;
//   companyData: any;
//   stripeInfo: any;
//   refreshActions: {
//     setRefreshUID: React.Dispatch<React.SetStateAction<any>>;
//   };
// }

// export const GlobalModalManager: React.FC<GlobalModalManagerProps> = ({
//   companyUID,
//   companyData,
//   stripeInfo,
//   refreshActions
// }) => {
//   const { currentUser, dbURL, currentModal, setCurrentModal } = useAuth();

//   if (!currentModal) return null;

//   const getModalTitle = () => {
//     switch (currentModal) {
//       case 'feedback': return 'Give Feedback';
//       case 'invite': return 'Invite Team Members';
//       case 'billing': return 'Billing & Workspace Subscription';
//       default: return '';
//     }
//   };

//   return (
//     <ModalShell
//       isOpen={Boolean(currentModal)}
//       title={getModalTitle()}
//       onClose={() => setCurrentModal(null)}
//       maxWidth={currentModal === 'billing' ? 'xl' : currentModal === 'feedback' ? 'lg' : 'sm'}
//       className="bg-slate-50/40"
//     >
//       {currentModal === 'feedback' && <Feedback_Container />}
      
//       {currentModal === 'invite' && (
//         <Invite_Container 
//           userInfo={currentUser} 
//           company={companyData} 
//           setRefreshUID={refreshActions.setRefreshUID} 
//           dbURL={dbURL!} 
//         />
//       )}
      
//       {currentModal === 'billing' && (
//         <Billing_Container 
//           userInfo={currentUser} 
//           stripeInfo={stripeInfo} 
//           company={companyData} 
//           isShowingCheckout={false} 
//           setIsShowingCheckout={() => {}} 
//           boardUID={companyUID} 
//           isToolTipOpen={false} 
//           setIsToolTipOpen={() => {}} 
//           setCurrentTooltip={() => {}} 
//           handleModalOpen={(name: string) => setCurrentModal(name)} 
//           handleToolTipOpen={() => {}}
//         />
//       )}
//     </ModalShell>
//   );
// };