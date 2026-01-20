import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_TOKEN;
const JWT_EXPIRES_IN = process.env.JWT_TOKEN_REFRESH;
console.log("JWT_SECRET:", JWT_SECRET);
export const signJwt = (payload: object) => {
  jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: Number(JWT_EXPIRES_IN),
  });
};
export const verifyJwt = (token: string) => {
  jwt.verify(token, JWT_SECRET as string);
};
