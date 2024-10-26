import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useState, useEffect } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/stringToColor";
import { BlockNoteEditor } from "@blocknote/core";
// Import Yjs only once at the top level
import * as Y from "yjs";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

// Move types outside of component
type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

// Separate BlockNote component to handle editor-specific logic
function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const [userInfo] = useSelf((me) => [me.info]);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
    // Add default content if needed
    initialContent: undefined,
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

// Main Editor component
function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Yjs and provider only once
  useEffect(() => {
    let yDoc: Y.Doc | null = null;
    let yProvider: LiveblocksYjsProvider | null = null;

    try {
      yDoc = new Y.Doc();
      yProvider = new LiveblocksYjsProvider(room, yDoc);

      setDoc(yDoc);
      setProvider(yProvider);
    } catch (error) {
      console.error('Error initializing Yjs:', error);
    }

    // Cleanup function
    return () => {
      if (yProvider) {
        yProvider.destroy();
      }
      if (yDoc) {
        yDoc.destroy();
      }
    };
  }, [room]);

  // Render nothing while initializing
  if (!doc || !provider) {
    return null;
  }

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">

       <Button variant="outline">
        <TranslateDocument doc={doc}/>
       </Button>

       <Button variant="outline">
        <ChatToDocument doc={doc}/>
       </Button>


        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <BlockNote 
        doc={doc} 
        provider={provider} 
        darkMode={darkMode}
      />
    </div>
  );
}

export default Editor;