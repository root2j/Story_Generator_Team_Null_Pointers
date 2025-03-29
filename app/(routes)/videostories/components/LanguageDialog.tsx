import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Earth } from "lucide-react";

interface LanguageDialogProps {
    language: string;
    setLanguage: (language: string) => void;
}
const languages = ["English", "Marathi", "Hindi", "French", "German", "Japanese", "Other"];

const LanguageDialog: React.FC<LanguageDialogProps> = ({ language, setLanguage }) => {
    const [open, setOpen] = useState(false);

    const [dialogLanguage, setDialogLanguage] = useState("English");
    const [customLanguage, setCustomLanguage] = useState("");
    const [isOther, setIsOther] = useState(false);


    useEffect(() => {
        if (open) {
            const isCurrentInList = languages.includes(language);
            setDialogLanguage(isCurrentInList ? language : "Other");
            setIsOther(!isCurrentInList);
            setCustomLanguage(isCurrentInList ? "" : language);
        }
    }, [open, language]);

    const handleLanguageChange = (value: string) => {
        if (value === "Other") {
            setIsOther(true);
            setDialogLanguage("Other");
        } else {
            setIsOther(false);
            setCustomLanguage("");
            setDialogLanguage(value);
        }
    };

    const handleSave = () => {
        const finalLanguage = isOther ? customLanguage : dialogLanguage;
        setLanguage(finalLanguage);
        setOpen(false);
    };

    return (
        <>
            <div className="flex items-center gap-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-950" size={"sm"}>
                            <Earth className="w-4 h-4" /> {language}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-md w-full">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Select Preferred Language
                            </DialogTitle>
                        </DialogHeader>

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 mt-4"
                        >
                            <Select
                                value={dialogLanguage}
                                onValueChange={handleLanguageChange}
                            >
                                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-700">
                                    {languages.map((lang) => (
                                        <SelectItem
                                            key={lang}
                                            value={lang}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {lang}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {isOther && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Input
                                        placeholder="Enter custom language"
                                        value={customLanguage}
                                        onChange={(e) => setCustomLanguage(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-700"
                                    />
                                </motion.div>
                            )}

                            <Button
                                onClick={handleSave}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Confirm Selection
                            </Button>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

export default LanguageDialog