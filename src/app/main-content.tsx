"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden bg-slate-950">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col bg-slate-900">
                <div className="h-14 flex items-center px-6 border-b border-slate-800">
                  <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">React Component Generator</h1>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-[1px] bg-slate-800 hover:bg-slate-700 transition-colors" />

            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-slate-900">
                <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950">
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList className="bg-slate-800/60 border border-slate-700/60 p-0.5 h-9">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-sm text-slate-400 px-4 py-1.5 text-sm font-semibold transition-all rounded-full">Preview</TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 data-[state=active]:shadow-sm text-slate-400 px-4 py-1.5 text-sm font-semibold transition-all rounded-full">Code</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                <div className="flex-1 overflow-hidden bg-slate-950">
                  {activeView === "preview" ? (
                    <div className="h-full bg-slate-950">
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                      >
                        <div className="h-full bg-slate-900 border-r border-slate-800">
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle className="w-[1px] bg-slate-800 hover:bg-slate-700 transition-colors" />

                      <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-slate-900">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
