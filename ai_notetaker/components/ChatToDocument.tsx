'use client'
import React, { FormEvent, useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Input } from './ui/input'
import Markdown from 'react-markdown'
import * as Y from "yjs";
import { BotIcon } from 'lucide-react'

const ChatToDocument = ({doc}: {doc : Y.Doc}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [input, setInput] = useState("");
    const [summary, setSummary] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault();
        setQuestion(input);

        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();
          
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  documentData,
                  question: input,
                }),
              }
            );
          
            if (res.ok) {
                const data = await res.json();
                const message = typeof data.message === 'string' ? data.message : data.message.response;
                setInput("");
                setSummary(message);
                toast.success("Question asked successfully!!");
             }
          });
        };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger >
                Ask Question
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask Question</DialogTitle>
                    <DialogDescription>
                        Enter the question that you want to ask
                    </DialogDescription>
                    <hr className="mt-5" />
                    {question && <p className="mt-5 text-gray-500"> Q: {question}</p>}
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
                <form className='flex gap-2' onSubmit={handleAskQuestion}>
                    <Input
                        type="text"
                        placeholder="i.e. What's this about"
                        className="w-full mb-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit" disabled={!input || isPending}>
                        {isPending ? "Asking..." : "Ask"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default ChatToDocument