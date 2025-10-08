"use client"
import * as React from "react"

export function DebugReactExports() {
    const allExports = Object.keys(React).sort();

    return (
        <div style={{ fontFamily: 'monospace', padding: '20px' }}>
            <h2>React Exports in Browser:</h2>
            <pre>
                {allExports.map(key => {
                    const value = (React as any)[key];
                    const type = typeof value;
                    const preview = type === 'symbol' ? String(value) : type;
                    return `${key}: ${preview}\n`;
                }).join('')}
            </pre>
            <hr />
            <h3>Activity specifically:</h3>
            <pre>
                Activity in React: {('Activity' in React).toString()}
                {'\n'}
                React.Activity: {String((React as any).Activity)}
                {'\n'}
                typeof React.Activity: {typeof (React as any).Activity}
            </pre>
        </div>
    );
}
