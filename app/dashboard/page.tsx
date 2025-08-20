"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoteCard from "@/components/dashboard/NoteCard";
import NoteDialog from "@/components/dashboard/NoteDialog";
import { Note } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchNotes = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      // Sort by newest first
      const sortedNotes = data.sort(
        (a: Note, b: Note) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setNotes(sortedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotes();
    }
  }, [fetchNotes, session?.user?.id]);

  const handleCreateNote = () => {
    setDialogMode("create");
    setEditingNote(null);
    setIsDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setDialogMode("edit");
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleSaveNote = async (noteData: {
    title: string;
    content: string;
  }) => {
    try {
      if (dialogMode === "create") {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) {
          throw new Error("Failed to create note");
        }
      } else if (editingNote) {
        const response = await fetch(`/api/notes/${editingNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) {
          throw new Error("Failed to update note");
        }
      }

      await fetchNotes();
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setDeletingNoteId(noteId);
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect to signin
  }

  const activeNotes = notes.filter((note) => !note.isArchived);
  const archivedNotes = notes.filter((note) => note.isArchived);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session?.user?.name || session?.user?.email}!
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message for New Users */}
        {!session?.user?.name && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      👋
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Welcome to NoteFlow!
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    You&apos;re all set up and ready to start taking notes.
                    Click the button below to create your first note.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {notes.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeNotes.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Archived Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">
                {archivedNotes.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Note Button */}
        <div className="mb-8">
          <Button onClick={handleCreateNote} className="w-full md:w-auto">
            Create Note
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first note to get started.
            </p>
            <Button onClick={handleCreateNote}>Create your first note</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note.id)}
                isDeleting={deletingNoteId === note.id}
              />
            ))}
          </div>
        )}

        {/* Archived Notes Section */}
        {archivedNotes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Archived Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                  isDeleting={deletingNoteId === note.id}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Note Dialog */}
      <NoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode={dialogMode}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}
