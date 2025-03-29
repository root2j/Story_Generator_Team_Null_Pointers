/* -------------------------------------------------------------------------- */
/*                         RestoreDialog Component                          */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RestoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRestore: () => void;
    onDismiss: () => void;
}

const RestoreDialog: React.FC<RestoreDialogProps> = ({
    open,
    onOpenChange,
    onRestore,
    onDismiss,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>Restore Previous Session?</DialogTitle>
                    <DialogDescription>
                        We found previously saved content. Would you like to restore it?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-4">
                    <Button variant="destructive" onClick={onDismiss}>
                        Dismiss
                    </Button>
                    <Button onClick={onRestore}>Restore</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RestoreDialog;