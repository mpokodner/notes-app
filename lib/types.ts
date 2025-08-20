export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateUserInput {
  email: string;
  name?: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  userId: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  isArchived?: boolean;
}
