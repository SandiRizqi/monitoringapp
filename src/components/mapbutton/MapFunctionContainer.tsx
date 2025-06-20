import React from 'react';
import { ReactNode } from "react";

 type Props = {
      children: ReactNode;
    };
    
export default function MapFunctionContainer({ children }: Props) {
  return (
    <div className='absolute bottom-2 left-4 z-50 flex gap-2'>{children}</div>
  )
}
