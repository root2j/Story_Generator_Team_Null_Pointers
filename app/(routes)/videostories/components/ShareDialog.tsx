/* -------------------------------------------------------------------------- */
/*                           ShareDialog Component                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dynamicUrl: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onOpenChange, dynamicUrl }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(dynamicUrl);
        alert("URL copied to clipboard!");
    };

    const handleWhatsApp = () => {
        const message = `Check out my saved content: ${dynamicUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>Share Your Content</DialogTitle>
                    <DialogDescription>
                        Share this URL with others. When they click the URL, they can view your saved content.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 my-4">
                    <Input type="text" value={dynamicUrl} readOnly className="w-full" />
                    <Button onClick={handleCopy}>Copy</Button>
                </div>
                <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={handleWhatsApp}>
                        Share on WhatsApp
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;