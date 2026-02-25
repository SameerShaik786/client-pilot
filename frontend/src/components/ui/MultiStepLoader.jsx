"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const CheckIcon = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={cn("w-6 h-6", className)}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
};

const CheckFilled = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn("w-6 h-6", className)}
        >
            <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
            />
        </svg>
    );
};

const LoaderCore = ({
    loadingStates,
    value = 0,
}) => {
    return (
        <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
            {loadingStates.map((loadingState, index) => {
                const distance = Math.abs(index - value);
                const opacity = Math.max(1 - distance * 0.2, 0);

                return (
                    <motion.div
                        key={index}
                        className={cn("text-left flex gap-2 mb-4")}
                        initial={{ opacity: 0, y: -(value * 40) }}
                        animate={{ opacity: opacity, y: -(value * 40) }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            {index > value && <CheckIcon className="text-white/30" />}
                            {index <= value && (
                                <CheckFilled
                                    className={cn(
                                        "text-white",
                                        value === index && "text-emerald-500 opacity-100"
                                    )}
                                />
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-white/50 text-lg",
                                value === index && "text-emerald-500 opacity-100 font-bold"
                            )}
                        >
                            {loadingState.text}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export const MultiStepLoader = ({
    loadingStates,
    loading,
    duration = 2000,
    loop = true,
}) => {
    const [currentState, setCurrentState] = useState(0);

    useEffect(() => {
        if (!loading) {
            setCurrentState(0);
            return;
        }
        const timeout = setTimeout(() => {
            setCurrentState((prev) =>
                loop
                    ? prev === loadingStates.length - 1
                        ? 0
                        : prev + 1
                    : Math.min(prev + 1, loadingStates.length - 1)
            );
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentState, loading, loop, loadingStates.length, duration]);

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-3xl bg-black/60"
                >
                    <div className="h-96 relative">
                        <LoaderCore value={currentState} loadingStates={loadingStates} />
                    </div>
                    {/* Dark gradient mask */}
                    <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
