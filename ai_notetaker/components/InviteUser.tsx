'use client'
import React, { FormEvent, useState, useTransition } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { deleteDocument, inviteUsersToDocument } from '@/actions/actions'
import { toast } from 'sonner'
import { Input } from './ui/input'



const InviteUser = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState("")
    const pathname = usePathname();
    const router = useRouter();

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();

        const roomId = pathname.split("/").pop();
        if (!roomId) return;

        startTransition(async () => {
            const { success } = await inviteUsersToDocument(roomId, email);

            if (success) {
                setIsOpen(false);
                setEmail("");
                toast.success("User Added successfully!");
            } else {
                toast.error("Failed to add user to the room!");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger >
                Invite
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite user to collaborate</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to invite
                    </DialogDescription>
                </DialogHeader>
                <form className='flex gap-2' onSubmit={handleInvite}>
                    <Input
                        type="email"
                        placeholder="Email"
                        className="w-full mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" disabled={!email || isPending}>
                        {isPending ? "Inviting..." : "Invite"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default InviteUser