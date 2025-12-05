export type UserType =  {
  id: number;
  fullName: string;
  college: string;
  email: string;
  role: "admin" | "techgen" | "up-official";
}