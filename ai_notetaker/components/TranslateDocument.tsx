import * as Y from "yjs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState, useTransition, FormEvent } from "react";
import { Button } from "./ui/button";
import Markdown from 'react-markdown'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";


type Language =
    | "english"
    | "spanish"
    | "portuguese"
    | "french"
    | "german"
    | "chinese"
    | "arabic"
    | "hindi"
    | "russian"
    | "japanese"
    | "urdu";

const languages: Language[] = [
    "english",
    "spanish",
    "portuguese",
    "french",
    "german",
    "chinese",
    "arabic",
    "hindi",
    "russian",
    "japanese",
    "urdu"
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState("");
    const [summary, setSummary] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleTranslate = (e: FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentData,
                        targetLang: language,
                    }),
                }
            );

            if (res.ok) {
                let { translated_text } = await res.json();
                translated_text = translated_text.replace(/<\/?[^>]+(>|$)/g, "");
                setSummary(translated_text);
                toast.success("Translated Summary successfully!");
            }

        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger >
                <div className="flex gap-1">
                    <LanguagesIcon />
                    Translate
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate Document</DialogTitle>
                    <DialogDescription>
                        Select a language and AI will translate the summary of the document in the selected language.
                    </DialogDescription>

                    <hr className="mt-5" />
                    {language && <p className="mt-5 text-gray-500"> Q: {language}</p>}

                </DialogHeader>

                {summary && (
                    <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-2 bg-gray-100">
                        <div className="flex">
                            <BotIcon className="w-10 flex-shrink-0" />
                            <p className="font-bold">
                                GPT: {isPending ? "is thinking..." : "'s says:"}
                            </p>
                        </div>
                        <p>
                            {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
                        </p>
                    </div>
                )}
                <form className='flex gap-2' onSubmit={handleTranslate}>
                    <Select value={language} onValueChange={(value) => (setLanguage(value))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>

                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language} value={language}>
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>

                    </Select>
                    <Button type="submit" disabled={!language || isPending}>
                        {isPending ? "Translating..." : "Translate"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TranslateDocument