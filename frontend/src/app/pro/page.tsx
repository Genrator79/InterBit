"use client";

import { useContext, useEffect } from "react";
import PricingSection from "@/components/landing/PricingSection";
import Navbar from "@/components/Navbar";
import { CrownIcon } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function ProPage() {
    const { user } = useContext(UserContext);
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (user === null) {
            // Only redirect if user is explicitly null (loaded and not logged in)
            router.push("/");
        }
    }, [user, router]);

    // Show loading while user is undefined (still loading)
    if (user === undefined) return <div className="p-8 text-center">Loading...</div>;
    if (user === null) return null; // redirect in progress

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
                <div className="mb-12 overflow-hidden">
                    <div className="flex items-center justify-between bg-gradient-to-br from-primary/10 to-background rounded-3xl p-8 border border-primary/20">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-primary">
                                    Upgrade to Pro
                                </span>
                            </div>

                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    Unlock Premium AI Interview Features
                                </h1>
                                <p className="text-muted-foreground">
                                    Get unlimited AI mock interviews, personalized feedback, mentor guidance,
                                    and priority support to supercharge your interview preparation.
                                </p>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                <CrownIcon className="w-16 h-16 text-primary" />
                            </div>
                        </div>
                    </div>
                    {/* PRICING SECTION */}
                    <PricingSection />
                </div>
            </div>
        </>
    );
}
