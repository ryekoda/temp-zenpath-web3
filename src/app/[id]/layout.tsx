'use client'

import { ReactNode } from "react";
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';



interface Props {
    children: ReactNode
}

// App pages expect the signed-in user to be loaded before they render.
export default function AppLayout({ children }: Props) {
    const { isLoading } = useAuth()

    if (isLoading) return <LoadingScreen/>
    return <>{ children }</>
}
