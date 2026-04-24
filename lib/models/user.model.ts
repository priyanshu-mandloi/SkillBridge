import { ObjectId } from "mongodb";

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  skills: string[];
  avatar: string;
  role: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<UserDocument, "password"> & {
  id: string;
};

export function toSafeUser(doc: UserDocument): SafeUser {
  const { password: _, _id, ...rest } = doc;
  return { ...rest, id: _id!.toString() };
}
