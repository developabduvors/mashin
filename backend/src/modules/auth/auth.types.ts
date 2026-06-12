export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
  createdAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
