import * as SQLite from "expo-sqlite";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "customer" | "admin";
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

let db: SQLite.SQLiteDatabase | null = null;

const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("userDatabase.db");
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT,
        creationAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
  }
  return db;
};

export const createUsers = async (users: User[]) => {
  const db = await openDatabase();

  // Construct a single SQL statement to insert multiple rows
  const valuesPlaceholder = users
    .map(() => `(?, ?, ?, ?, ?, ?, ?, ?)`)
    .join(", ");

  const values = users.flatMap((user) => [
    user.id,
    user.email,
    user.password,
    user.name,
    user.role,
    user.avatar,
    user.creationAt,
    user.updatedAt,
  ]);

  const sql = `
      INSERT OR REPLACE INTO users 
      (id, email, password, name, role, avatar, creationAt, updatedAt) 
      VALUES ${valuesPlaceholder};
    `;

  await db.runAsync(sql, ...values);
};

export const getAllUsers = async (): Promise<User[]> => {
  const db = await openDatabase();
  const allRows = await db.getAllAsync(`SELECT * FROM users`);
  return allRows as User[];
};
export const addUser = async (
  user: Omit<User, "id" | "creationAt" | "updatedAt" | "avatar">
): Promise<User> => {
  const db = await openDatabase();

  // Generate random unique id
  const id = Math.floor(Math.random() * 1000000);

  // Get current timestamps
  const timestamp = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO users (id, email, password, name, role, avatar, creationAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    id,
    user.email,
    user.password,
    user.name,
    user.role,
    "",
    timestamp,
    timestamp
  );
  return {
    ...user,
    creationAt: timestamp,
    updatedAt: timestamp,
    avatar: "",
    id,
  };
};
export const getUserById = async (id: number): Promise<User | null> => {
  const db = await openDatabase();
  const user = await db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, id);
  return user ? (user as User) : null;
};

export const updateUser = async (user: User) => {
  const db = await openDatabase();
  await db.runAsync(
    `UPDATE users SET email = ?, password = ?, name = ?, role = ?, avatar = ?, creationAt = ?, updatedAt = ?
     WHERE id = ?;`,
    user.email,
    user.password,
    user.name,
    user.role,
    user.avatar,
    user.creationAt,
    user.updatedAt,
    user.id
  );
};

export const deleteUserFromDB = async (id: number) => {
  const db = await openDatabase();
  await db.runAsync(`DELETE FROM users WHERE id = ?`, id);
};
