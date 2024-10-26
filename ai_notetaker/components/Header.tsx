'use client'
import { SignedIn, SignInButton, UserButton, SignedOut } from '@clerk/clerk-react';
import {  useUser } from '@clerk/nextjs'
import React from 'react'
import Breadcrumbs from './BreadCrumbs';

const Header = () => {
    const {user} = useUser();

  return (
    <div className='flex items-center justify-between p-5'>
    {
        user && (
            <h1 className='font-size:25px  font-semibold'>
                {user?.firstName}
                {`'s `}
                Workspace
            </h1>
        )
    }

    { /* BreadCrumbs */ }
    <Breadcrumbs/>

    <div>
        <SignedOut>
            <SignInButton></SignInButton>
        </SignedOut>

        <SignedIn>
            <UserButton/>
        </SignedIn>
    </div>

    </div>
  )
}

export default Header