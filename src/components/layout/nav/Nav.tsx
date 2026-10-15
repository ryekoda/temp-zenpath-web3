'use client'

import { FC } from "react";
import { useAuth } from '@/context/AuthContext';

import MarketingNav from './MarketingNav';
import AppSidebar from './sidebar/AppSidebar';



interface Props {
  isLoggedInCookie: boolean
}

const Nav: FC<Props> = ({ isLoggedInCookie }) => {
  const { currentUser, isLoading } = useAuth()

  // Until Firebase answers, trust the isLoggedIn cookie (read on the server in layout.tsx),
  // so signed-out visitors get the top nav in the first HTML and signed-in users see no flash.
  const isShowingTopNav = isLoading ? !isLoggedInCookie : !currentUser
  if (isLoading && !isShowingTopNav) return null

  if (isShowingTopNav) {
    return (
      <div className='fixed z-50 inset-x-0 top-0 print:hidden'>
        <MarketingNav/>
      </div>
    )
  }

  return (
    <div className='fixed z-50 top-0 left-0 print:hidden'>
      <AppSidebar/>
    </div>
  )
}


export default Nav
