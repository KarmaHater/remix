import db from "../db.server";

export function getUser(email: string) {
  return db.user.findUnique({ where: { email } });
}

export function getUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}
