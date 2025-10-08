"use client"
import { Activity } from "react"

export function ActivityTest() {
    return (
        <Activity mode="visible">
            <p>This content is visible</p>
        </Activity>
    );
}

export function ActivityTestHidden() {
    return (
        <Activity mode="hidden">
            <p>This content is hidden</p>
        </Activity>
    );
}
