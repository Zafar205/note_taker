'use client'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import NewDocumentButton from './NewDocumentButton';
import { MenuIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useCollection } from "react-firebase-hooks/firestore"
import { collectionGroup, DocumentData, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useEffect, useState } from 'react';
import SidebarOption from './SidebarOption'
interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
    id?: string; // Added id as it's used in the reduce function
}

interface GroupedData {
    owner: RoomDocument[];
    editor: RoomDocument[];
}

const Sidebar = () => {
    const { user, isLoaded } = useUser();

    const [groupedData, setGroupedData] = useState<GroupedData>({
        owner: [],
        editor: []
    });

    const [data, loading, error] = useCollection(
        user ?
        query(
            collectionGroup(db, "rooms"),
            where("userId", "==", user.emailAddresses[0].emailAddress) // Fixed: use emailAddress property
        )
        : null
    );

    useEffect(() => {
        if (!data) return;

        const grouped = data.docs.reduce<GroupedData>((acc, current) => {
            const roomData = current.data() as RoomDocument;
            const docWithId = {
                ...roomData,
                id: current.id,
            };

            if (roomData.role === "owner") {
                acc.owner.push(docWithId);
            } else {
                acc.editor.push(docWithId);
            }

            return acc;
        }, {
            owner: [],
            editor: []
        });

        setGroupedData(grouped);
    }, [data]);

    const menuData = (
        <>
            <NewDocumentButton />

            <div className="flex py-4 flex-col space-y-4 md:max-w-36">
            {groupedData.owner.length === 0 ? (
                <h2 className="text-gray-500 font-semibold text-sm">
                    No Documents Found
                </h2>
            ) : (
                <>
                    <h2 className="text-gray-500 font-semibold text-sm">
                        My Documents
                    </h2>
                    {groupedData.owner.map((doc) => (
                        // <p key={doc.id}>{doc.roomId}</p>
                        <SidebarOption key={doc.id} id={doc.id!} href={`/doc/${doc.id}`} />
                    ))}
                </>
            )}

            {/* shared with me  */}
        {groupedData.editor.length > 0 && (
            <>
                <h2 className="text-gray-500 font-semibold text-sm">
                Shared with Me
                </h2>
                {groupedData.editor.map((doc) => (
                    <SidebarOption key={doc.id} id={doc.id!} href={`/doc/${doc.id}`} />
                ))}
            </>)
            }
            </div>


        </>
    );

    return (
        <div className='p-2 md:p-5 bg-gray-200 relative'>
            <div className='md:hidden'>
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className='p-2 hover:opacity-30 rounded-lg' size={40} />
                    </SheetTrigger>

                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>{menuData}</div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            
            <div className='hidden md:inline'>{menuData}</div>
        </div>
    );
}

export default Sidebar