// app/[id]/reports/_hooks/useReportOrganizerData.ts
import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import useTrips from '@/hooks/useTrips';
import useClients from '@/hooks/useClients';
import useEmployees from '@/hooks/useEmployees';
import { HeaderTitles } from '@/lib/GlobalFunctions';

interface ReportOrganizerData {
    state: {
        isLoading: boolean;
        currentUser: any;
        stripeInfo: any;
        dbURL: string | undefined;
        company: any;
        companySettings: any;
        trips: any[] | null;
        clients: any[];
        drivers: any[];
        activeHeaders: any[];
        filterDate: Date;
        selectedDriverUID: string | undefined;
        sortSectionUID: string;
        sortDirection: string;
        selectedModalName: string | null;
        isModalOptionsShowing: boolean;
    };
    actions: {
        setFilterDate: Dispatch<SetStateAction<Date>>;
        setSelectedDriverUID: Dispatch<SetStateAction<string | undefined>>;
        setRefreshUID: Dispatch<SetStateAction<any>>;
        setIsLoading: Dispatch<SetStateAction<boolean>>;
        setSortSectionUID: Dispatch<SetStateAction<string>>;
        setSortDirection: Dispatch<SetStateAction<string>>;
        setSelectedModalName: Dispatch<SetStateAction<string | null>>;
        setIsModalOptionsShowing: Dispatch<SetStateAction<boolean>>;
        setCurrentTooltip: Dispatch<SetStateAction<any>>;
        handleModalOpen: (modalName: string) => void;
        handleToolTipOpen: (tooltipName: string, event: React.MouseEvent) => void;
        handleModalClose: (shouldRefresh?: boolean) => void;
        handleModalOption: (viewName: string, isShowing: boolean) => void;
    };
}

export function useReportOrganizerData(companyUID: string): ReportOrganizerData {
    const { currentUser, stripeInfo, dbURL } = useAuth();
    
    // Core functional states
    const [refreshUID, setRefreshUID] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterDate, setFilterDate] = useState<Date>(new Date());
    const [selectedDriverUID, setSelectedDriverUID] = useState<string | undefined>();
    const [sortSectionUID, setSortSectionUID] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<string>('default');
    
    // Modal & tooltip workflow orchestration states
    const [selectedModalName, setSelectedModalName] = useState<string | null>(null);
    const [isModalOptionsShowing, setIsModalOptionsShowing] = useState<boolean>(false);
    const [currentTooltip, setCurrentTooltip] = useState<any>(null);

    // Core Data Fetching Streams
    const company = useCompany(companyUID, stripeInfo, true, refreshUID, dbURL);
    const companySettings = useCompanySettings(companyUID, 'reports', refreshUID, true, dbURL);
    const trips = useTrips(companyUID, null, selectedDriverUID, null, filterDate, null, refreshUID, true, dbURL, isLoading, setIsLoading);

    // Extract sub-dependencies for secondary stream hydration
    const clientUIDs = useMemo<string[]>(() => {
        if (!trips || trips.length === 0) return [];
        return trips.map((trip: any) => trip['71130']).filter(Boolean);
    }, [trips]);

    // Secondary Asset Lookups    
    const clients = useClients(companyUID, clientUIDs, null, refreshUID, true, dbURL, isLoading, setIsLoading, true);
    const drivers = useEmployees(companyUID, 'driver', null, null, true, dbURL);
    // console.log("Cliennnnnn: ", clientUIDs.length > 0 ? clients.length : null);

    // Parse dynamic user-defined display layouts
    const activeHeaders = useMemo(() => {
        return HeaderTitles(companySettings, true) || [];
    }, [companySettings]);

    // Operational event handlers for header and shell layout integration
    const handleModalOpen = (modalName: string) => {
        setSelectedModalName(modalName);
    };

    const handleToolTipOpen = (tooltipName: string, event: React.MouseEvent) => {
        setCurrentTooltip({ name: tooltipName, target: event.currentTarget });
    };

    const handleModalClose = (shouldRefresh = false) => {
        setSelectedModalName(null);
        setIsModalOptionsShowing(false);
        if (shouldRefresh) {
            setRefreshUID(Math.random().toString(36).substring(7));
        }
    };

    const handleModalOption = (viewName: string, isShowing: boolean) => {
        setIsModalOptionsShowing(isShowing);
        console.log(`Navigating to inner option view: ${viewName}`);
    };

    return {
        state: { 
            isLoading, 
            currentUser, 
            stripeInfo,
            dbURL,
            company, 
            companySettings,
            trips, 
            clients,
            drivers,
            activeHeaders,
            filterDate, 
            selectedDriverUID,
            sortSectionUID,
            sortDirection,
            selectedModalName,
            isModalOptionsShowing
        },
        actions: { 
            setFilterDate, 
            setSelectedDriverUID, 
            setRefreshUID,
            setIsLoading,
            setSortSectionUID,
            setSortDirection,
            setSelectedModalName,
            setIsModalOptionsShowing,
            setCurrentTooltip,
            handleModalOpen,
            handleToolTipOpen,
            handleModalClose,
            handleModalOption
        }
    };
}