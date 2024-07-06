export interface Comment {
  id: number,
  content: string,
  timestamp: string,
  profileId: number
  profile: Profile
  author: Profile
}

export interface Stats {
  doctors: number,
  pacients: number,
  comments: number,
  recentComments: number
}

export interface Profile {
  id: number,
  firstName: string,
  lastName: string,
  birthDate: string,
  address: string,
  bloodType: string,
  gender: string,
  height: string,
  weight: string
  comments: Comment[]
}

export interface AddProfile {
  id: number,
  firstName: string,
  lastName: string,
  birthDate: string,
  address: string,
  bloodType: string,
  gender: string,
  height: string,
  weight: string
}

export interface AddUser {
  cnp: string,
  role: "doctor" | "pacient",
  firstName: string,
  lastName: string,
}

export interface AddComment {
  content: string,
}

export interface PublicUser {
  id: number,
  cnp: string,
  role: "admin" | "doctor" | "pacient",
  profile: Profile
}

export interface PrivateUser extends PublicUser {
  password: string,
}