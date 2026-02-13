"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const uid = data.user.id;
      setUserId(uid);

      const { data: bookmarksData } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (bookmarksData) setBookmarks(bookmarksData);
      setLoading(false);

      channel = supabase
        .channel(`bookmarks-${uid}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id),
              );
            }

            if (payload.eventType === "UPDATE") {
              setBookmarks((prev) =>
                prev.map((b) =>
                  b.id === payload.new.id ? (payload.new as Bookmark) : b,
                ),
              );
            }
          },
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  // 🔎 Search filtering
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.url.toLowerCase().includes(search.toLowerCase()),
    );
  }, [bookmarks, search]);

  // Add
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !userId) return;

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: userId }]);

    if (error) toast.error("Failed to add");
    else {
      toast.success("Bookmark added");
      setTitle("");
      setUrl("");
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) toast.error("Delete failed");
    else toast.success("Deleted");
  };

  // Edit start
  const startEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  // Save edit
  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({ title: editTitle, url: editUrl })
      .eq("id", id);

    if (error) toast.error("Update failed");
    else {
      toast.success("Updated");
      setEditingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-10 w-64 bg-gray-800 rounded"></div>
          <div className="h-16 bg-gray-800 rounded-xl"></div>
          <div className="h-16 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>

        {/* Add Form */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            Add
          </button>
        </form>

        {/* Search */}
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 mb-8 rounded-xl bg-gray-800 border border-gray-700"
        />

        {/* List */}
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800/80 backdrop-blur border border-gray-700 p-5 rounded-2xl flex justify-between items-start shadow-lg"
              >
                <div className="flex-1 min-w-0 pr-4">
                  {editingId === bookmark.id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full mb-2 px-2 py-1 rounded bg-gray-700"
                      />
                      <input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-gray-700"
                      />
                    </>
                  ) : (
                    <>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold hover:text-blue-400 transition break-words"
                      >
                        {bookmark.title}
                      </a>
                      <p className="text-sm text-gray-400 mt-1 break-all">
                        {bookmark.url}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  {editingId === bookmark.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(bookmark.id)}
                        className="p-2 hover:bg-green-500/20 rounded-lg"
                      >
                        <Check className="text-green-400 w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 hover:bg-gray-600/20 rounded-lg"
                      >
                        <X className="text-gray-400 w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(bookmark)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg"
                      >
                        <Pencil className="text-blue-400 w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 className="text-red-500 w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center mt-16 text-gray-400">
            <p className="text-xl mb-2">No matching bookmarks</p>
          </div>
        )}
      </div>
    </div>
  );
}
