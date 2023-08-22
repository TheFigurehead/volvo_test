export interface JwtPayload {
  email: string;
  id: string;
  expiration?: Date;
}
