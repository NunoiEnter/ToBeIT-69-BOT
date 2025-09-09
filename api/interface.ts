export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
}

export interface PersonalData {
  id: string;
  prefix: string | null;
  firstname: string | null;
  surname: string | null;
  nickname: string | null;
  phone: string | null;
  bDate: Date | null;
  image: string | null;
  region: string | null;
  studyPlan: string | null;
  grade: string | null;
  school: string | null;
  userId: string | null;
  discordId: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
}
