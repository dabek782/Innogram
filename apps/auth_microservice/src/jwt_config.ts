import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_TOKEN;
const JWT_SECRET_EXPIRES = process.env.JWT_ACCESS_EXPIRES;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_SECRET_EXPIRES = process.env.JWT_REFRESH_EXPIRES;

if (!JWT_SECRET || !JWT_SECRET_EXPIRES) {
  throw new Error("Something went wrong with configuration jwt");
}
export const signAccessJwt = (payload: {
  userId: string;
  accountId: string;
  profileId: string | null;
}) => {
  return jwt.sign(
    {
      userId: payload.userId,
      accountId: payload.accountId,
      profileId: payload.profileId,
    },
    JWT_SECRET,
    { expiresIn: Number(JWT_SECRET_EXPIRES) },
  );
};
export const verifyAccessJwt = (token: string) => {
  const validation = jwt.verify(token, JWT_SECRET as string);
  if (!validation) {
    throw new Error("Verifying jwt went wrong");
  }
  return validation;
};
export const signRefreshJwt = (payload: { userId: string }) => {
  if (!JWT_REFRESH_SECRET || !JWT_REFRESH_SECRET_EXPIRES) {
    throw new Error("Something went wrong with configuration jwt");
  }
  return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, {
    expiresIn: Number(JWT_REFRESH_SECRET_EXPIRES),
  });
};
export const verifyRefreshJwt = (token: string) => {
  const validation = jwt.verify(token, JWT_REFRESH_SECRET as string);
  if (!validation) {
    throw new Error("Verifying jwt went wrong");
  }
  return validation;
};
