"use client";

import React, { useState, useEffect } from "react";

import Footer from "@/components/Footer/Footer";
import VideoPlayer from "@/components/Media/Video/VideoPlayer";
import { VideoAssets } from "@/store/allinterfaces";
import toast from "react-hot-toast";
import ProgressComponent from "../components/Progress";
import { SaveShareBar } from "../components/SaveShareBar";
import ProfessionalTextEditor from "../components/ProfessionalTextEditor";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const SceneGeneration = () => {
    const params = useParams();
    const { user } = useUser();

    const rawSceneId = params?.sceneId;
    const rawUserId = user?.id;

    console.log(rawUserId)

    // Ensure `sceneId` is a string (not an array)
    const sceneId = Array.isArray(rawSceneId) ? rawSceneId[0] : rawSceneId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    const decodedSceneId = decodeURIComponent(sceneId ?? "");
    const decodedUserId = decodeURIComponent(userId ?? "");
    const cleanSceneId = decodedSceneId.replace(/^sceneId=/, "");
    const cleanUserId = decodedUserId.replace(/^userId=/, "");

    const [isSaving, setIsSaving] = useState(false);
    const [dynamicUrl, setDynamicUrl] = useState<string>("");
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [finalVideoAssets, setFinalVideoAssets] = useState<VideoAssets | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [selectLanguage, setSelectLanguage] = useState("English");

    const router = useRouter();

    const fetchVideoAssets = async () => {
        if (!sceneId || !cleanSceneId || !cleanUserId) {
            router.push("/overview/scene-generation");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/video-assets?sceneId=${cleanSceneId}&userId=${cleanUserId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();

            if (data?.videoAssets) {
                setFinalVideoAssets(data.videoAssets);
            } else {
                router.push("/overview/scene-generation"); // Redirect if no assets found
            }
        } catch (err) {
            console.log(err);
            router.push("/overview/scene-generation"); // Redirect on error
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (sceneId && userId) {
            fetchVideoAssets();
        }
    }, [sceneId, userId]);


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
