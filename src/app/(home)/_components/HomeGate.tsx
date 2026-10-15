"use client"

import { FC, useEffect } from "react";
import { setCookie } from 'cookies-next';
import { useAuth } from '@/context/AuthContext';
import WorkspacesView from './workspaces/WorkspacesView';
import SplashPage from './splash/SplashPage';
import Restriction from "@/components/ui/Restriction";
import LoadingScreen from '@/components/ui/LoadingScreen';



interface Props {}

// Rendered by app/page.tsx when the isLoggedIn cookie says the visitor is signed in.
const HomeGate: FC<Props> = ({}) => {
    const { currentUser, isLoading } = useAuth()



    useEffect(() => {
        setCookie('isShowingMapView', 'true')
    }, [])


    if (isLoading) return <LoadingScreen/>

    // The cookie was stale (e.g. the session expired), so fall back to the Splash page.
    if (!currentUser) return <SplashPage/>

    return (
        <div>
            <div className="hidden md:block">
                <WorkspacesView/>
            </div>

            <div className='block md:hidden'>
                <Restriction/>
            </div>
        </div>
    )
};


export default HomeGate;
