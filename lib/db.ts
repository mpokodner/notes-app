import { prisma } from "./prisma";
import type {
  CreateUserInput,
  CreateNoteInput,
  UpdateNoteInput,
} from "./types";

// User operations
export async function createUser(data: CreateUserInput) {
  return prisma.user.create({
    data,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { notes: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { notes: true },
  });
}

// Note operations
export async function createNote(data: CreateNoteInput) {
  return prisma.note.create({
    data,
    include: { user: true },
  });
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function getNotesByUserId(userId: string) {
  return prisma.note.findMany({
    where: {
      userId,
      isArchived: false,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function updateNote(id: string, data: UpdateNoteInput) {
  return prisma.note.update({
    where: { id },
    data,
    include: { user: true },
  });
}

export async function deleteNote(id: string) {
  return prisma.note.delete({
    where: { id },
  });
}

export async function archiveNote(id: string) {
  return prisma.note.update({
    where: { id },
    data: { isArchived: true },
  });
}
