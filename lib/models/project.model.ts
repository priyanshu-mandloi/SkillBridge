import { ObjectId } from "mongodb";

export type ProjectStatus = "active" | "completed" | "archived";

export interface ProjectDocument {
  _id?: ObjectId;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  githubUrl: string;
  liveUrl: string;
  matchScore: number | null;
  userId: string; // stored as string (ObjectId.toString())
  createdAt: Date;
  updatedAt: Date;
}

export type SafeProject = Omit<ProjectDocument, "_id"> & {
  id: string;
};

export function toSafeProject(doc: ProjectDocument): SafeProject {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id!.toString() };
}
