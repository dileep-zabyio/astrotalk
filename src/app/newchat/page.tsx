"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";

interface ChatChild {
  id: string;
  message: string;
}

interface ChatSession {
  id: string;
  date: string;
  children: ChatChild[];
}
type user = {
  name: string;
  username: string;
  email: string;
  id: number;
};
export default function NewChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "folder-1",
      date: "Today",
      children: [
        {
          id: "file 1",
          message: "welcome to file 1",
        },
      ],
    },
    {
      id: "folder-2",
      date: "Yesterday",
      children: [
        {
          id: "file 2",
          message: "welcome to file 2",
        },
      ],
    },
    {
      id: "folder-3",
      date: "3 days ago",
      children: [
        {
          id: "file 3",
          message: "welcome to file 3",
        },
      ],
    },
  ]);

  const [users, setUser] = useState<user[]>([]);

  const callUser = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setUser(data);
      console.log(data, "09580934809348");
    } catch (error) {
      console.error(error, "error");
    }
  };

  useEffect(() => {
    callUser();
  }, []);
  const [activeSessionId, setActiveSessionId] = useState("folder 1");
  const [activeFileId, setActiveFileId] = useState("file 1");
  const [num, setNum] = useState(4);

  const handleNewChat = () => {
    const newId = `folder-${num}`;
    setNum((prev) => prev + 1);
    const newSession: ChatSession = {
      id: newId,
      date: "Today",
      children: [],
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newId);
  };

  const handleNewFile = () => {
    const newId2 = `file ${Date.now()}`;
    setSessions(
      sessions.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            children: [
              ...s.children,
              { id: newId2, message: `Welcome to ${newId2}` },
            ],
          };
        }
        return s;
      }),
    );
    setActiveFileId(newId2);
  };

  return (
    <div className="flex h-screen w-full">
      <aside className="w-72 sm:w-80 bg-black border-r border-slate-800 sm:block flex flex-col z-40 relative">
        <div className="flex flex-col p-3 justify-between">
          <button
            onClick={handleNewChat}
            className="flex w-full rounded-lg bg-neutral-200 justify-center hover:bg-neutral-300 text-black py-1.5 font-medium transition"
          >
            New +
          </button>
        </div>

        {
          <div className="pt-2 px-3">
            <label className="text-lg font-bold text-neutral-400">Chats</label>
            <div className="max-h-full overflow-y-auto pr-1 mt-2 space-y-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`w-[90%] flex flex-col items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition text-left truncate ${
                    activeSessionId === s.id
                      ? "bg-neutral-800 text-neutral-100 border border-neutral-500/80"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600/40"
                  }`}>
                  <div className="flex flex-row w-full justify-between items-center">
                    <span className="pl-2 flex-1">{s.id}</span>
                    <button
                      onClick={() => {
                        setActiveSessionId(s.id);
                        handleNewFile();
                      }}
                      className="flex rounded-lg bg-neutral-200 justify-center hover:bg-neutral-300 text-black py-1.5 font-medium transition"
                    >
                      <Plus className="w-8 h-4 shrink-0" />
                    </button>
                  </div>

                  <div className="flex flex-col bg-neutral-00 rounded-lg text-white">
                    {s.children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveFileId(c.id);
                        }}
                        className={`w-full flex align-bottom gap-2 px-2.5 py-1.5 rounded-lg text-xs transition text-left ${
                          activeFileId === c.id
                            ? "bg-neutral-800 text-neutral-100 border border-neutral-500/80"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600/40"
                        }`}
                      >
                        <span className="truncate flex-1">{c.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </aside>

      <div className="flex-1 flex flex-col h-full w-full items-center justify-center text-white overflow-hidden relative">
        <header className="">
          <div>
            {
              sessions
                .find((s) => s.children.find((c) => c.id === activeFileId))
                ?.children.find((c) => c.id === activeFileId)?.message
            }
            {users?.map((user) => (
              <>{user?.name}</>
            ))}
          </div>
        </header>
      </div>
    </div>
  );
}
