"use client"

import React from 'react'
import { SessionProvider } from 'next-auth/react';
import Header from './Header';


export default function SessionHeader() {
  return (
    <SessionProvider>
        <Header/>
    </SessionProvider>
  )
}
