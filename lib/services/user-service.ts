import { users, MOCK_CURRENT_USER_ID } from "@/lib/mock-data";
import type { User } from "@/types";

export async function getUsers(): Promise<User[]> {
  return users;
}

export async function getUserById(id: string): Promise<User | undefined> {
  return users.find((user) => user.id === id);
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  const wanted = new Set(ids);
  return users.filter((user) => wanted.has(user.id));
}

/**
 * MOCK ONLY: there is no authentication. This always returns the fixed
 * demo user so the dashboard has someone to act as. A real implementation
 * would resolve the signed-in session here instead.
 */
export async function getCurrentUser(): Promise<User> {
  const user = users.find((u) => u.id === MOCK_CURRENT_USER_ID);
  if (!user) throw new Error(`Mock current user "${MOCK_CURRENT_USER_ID}" not found`);
  return user;
}
