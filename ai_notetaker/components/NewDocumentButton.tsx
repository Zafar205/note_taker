'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from './ui/button'
import { createNewDocument } from '@/actions/actions'

const NewDocumentButton = () => {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreateNewDocument = () => {
        startTransition(
            async () => {
                const docId = await createNewDocument();
                router.push(`/doc/${docId}`);
            }
        )
    }

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
        {isPending ? "Making..." : "New Note"}
    </Button>
  )
}

export default NewDocumentButton