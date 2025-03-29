/* -------------------------------------------------------------------------- */
/*                         SaveShareBar Component                           */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/ui/button";
import LanguageDialog from "./LanguageDialog";

interface SaveShareBarProps {
    isSaving: boolean;
    content: string;
    setDynamicUrl: (url: string) => void;
    setShareDialogOpen: (open: boolean) => void;
    selectLanguage: string;
    setSelectLanguage: (language: string) => void;
}

export const SaveShareBar: React.FC<SaveShareBarProps> = ({ isSaving, content, setDynamicUrl, setShareDialogOpen, selectLanguage, setSelectLanguage }) => {

    const handleShare = () => {
        // Create a dynamic URL. In a real application, you'd generate a unique ID and store the content on a server.
        const url = `${window.location.origin}/share?content=${encodeURIComponent(content)}`;
        setDynamicUrl(url);
        setShareDialogOpen(true);
    };

    return (
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white">
            <h1 className="text-lg sm:text-2xl font-bold">Null Pointers Studio Video Generator</h1>
            <div className="flex gap-4 items-center">
                <LanguageDialog language={selectLanguage} setLanguage={setSelectLanguage} />
                <Button variant="secondary" size={"sm"}>
                    {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="secondary" size={"sm"} onClick={handleShare}>
                    Share
                </Button>
            </div>
        </div>
    );
};