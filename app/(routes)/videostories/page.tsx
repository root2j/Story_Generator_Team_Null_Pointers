"use client";

import React, { useState, useEffect } from "react";
import ProgressComponent from "./components/Progress";
import ProfessionalTextEditor from "./components/ProfessionalTextEditor";
import { SaveShareBar } from "./components/SaveShareBar";
import Footer from "@/components/Footer/Footer";
import VideoPlayer from "@/components/Media/Video/VideoPlayer";
import { VideoAssets } from "@/store/allinterfaces";

const SceneGeneration = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [dynamicUrl, setDynamicUrl] = useState<string>("");
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [finalVideoAssets, setFinalVideoAssets] = useState<VideoAssets | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [selectLanguage, setSelectLanguage] = useState("English");

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== "undefined") {
            setDynamicUrl(window.location.href);
        }
    }, []);

    return (
        <div className="w-full py-4 md:py-0 px-2 flex flex-col gap-2">
            <ProgressComponent currentStep={currentStep} />
            <SaveShareBar
                isSaving={isSaving}
                content={isClient ? dynamicUrl : ""}
                setDynamicUrl={setDynamicUrl}
                setShareDialogOpen={setShareDialogOpen}
                selectLanguage={selectLanguage}
                setSelectLanguage={setSelectLanguage}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <ProfessionalTextEditor
                        dynamicUrl={isClient ? dynamicUrl : ""}
                        shareDialogOpen={shareDialogOpen}
                        setShareDialogOpen={setShareDialogOpen}
                        setIsSaving={setIsSaving}
                        setCurrentStep={setCurrentStep}
                        setFinalVideoAssets={setFinalVideoAssets}
                        finalVideoAssets={finalVideoAssets}
                        selectLanguage={selectLanguage}
                    />
                    <div className="2xl:block hidden">
                        <Footer />
                    </div>
                </div>
                <VideoPlayer finalVideoAssets={finalVideoAssets} />
            </div>
            <div className="block 2xl:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default SceneGeneration;
