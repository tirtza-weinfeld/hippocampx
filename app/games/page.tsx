import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Games',
};

export default function Games() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">

            <h2 className="text-2xl font-bold p-4 m-4 text-accent   
            hover:text-secondary hover:animate-pulse transition-all hover:translate-y-5 hover:translate-x-5 hover:scale-150 duration-1000 cursor-pointer">
                GAMES

            </h2>
            <div className="w-full h-full flex flex-row">

                <div className="flex-1 bg-teal-900 rounded-md p-4 m-4">1</div>
                <div className="flex-1 bg-teal-800 rounded-md p-4 m-4">2</div>
                <div className="flex-1 bg-teal-700 rounded-md p-4 m-4">3</div>
                <div className="flex-1 bg-teal-600 rounded-md p-4 m-4">4</div>
            </div>
            <div className="w-full h-full flex flex-row">

                <div className="flex-1 bg-teal-900 rounded-md p-4 m-4">1</div>
                <div className="flex-1 bg-teal-800 rounded-md p-4 m-4">2</div>
                <div className="flex-1 bg-teal-700 rounded-md p-4 m-4">3</div>
                <div className="flex-1 bg-teal-600 rounded-md p-4 m-4">4</div>
            </div>
            <div className="w-full h-full flex flex-row">

                <div className="flex-1 bg-teal-900 rounded-md p-4 m-4">1</div>
                <div className="flex-1 bg-teal-800 rounded-md p-4 m-4">2</div>
                <div className="flex-1 bg-teal-700 rounded-md p-4 m-4">3</div>
                <div className="flex-1 bg-teal-600 rounded-md p-4 m-4">4</div>
            </div>
            <div className="w-full h-full flex flex-row h-screen">

                <div className="flex-1 bg-teal-900 rounded-md p-4 m-4">1</div>
                <div className="flex-1 bg-teal-800 rounded-md p-4 m-4">2</div>
                <div className="flex-1 bg-teal-700 rounded-md p-4 m-4">3</div>
                <div className="flex-1 bg-teal-600 rounded-md p-4 m-4">4</div>
            </div>
        </div>
    );
}
