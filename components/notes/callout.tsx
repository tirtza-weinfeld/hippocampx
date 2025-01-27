import React from 'react';

export function Callout({ children }: { children: React.ReactNode }) {
    return (<div className='bg-accent/10 p-4 rounded-md m-4 p-4'>
        {children}
        </div>);
}

