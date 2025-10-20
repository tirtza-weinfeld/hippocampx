"use client"
import { useState } from "react"
import { Activity } from "react"

export function A() {
    return (
        <p>Welcome to my A</p>
    );
}

export function B() {
    return (
        <p>Welcome to my B</p>

    );
}


export function M() {
    const [activeTab, setActiveTab] = useState('a');

    return (
        <>
            <button onClick={() => setActiveTab('a')}>
                A
            </button>
            <button onClick={() => setActiveTab('b')}>
                B
            </button>

            <Activity mode={activeTab === "a" ? "visible" : "hidden"}>
                <A />
            </Activity>
            <Activity mode={activeTab === "b" ? "visible" : "hidden"}>
                <B />
            </Activity>
        </>
    )
}


export function MdxActivity({ children, active }: { children: React.ReactNode, active: boolean }

) {
    return (
        <Activity mode={active ? "visible" : "hidden"}>
            {children}
        </Activity>
    )
}


