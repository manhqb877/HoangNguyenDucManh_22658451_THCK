import { SQLiteDatabase } from "expo-sqlite";
import { Movie } from "../types/Movie";
// Kiểu Movie (có thể đặt trong /types/movie.ts)


// ===========================
// INIT TABLE
// ===========================
export const initTables = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER,
      watched INTEGER DEFAULT 0,
      rating INTEGER,
      created_at INTEGER,
      isDeleted INTEGER DEFAULT 0
    );
  `);
};

// ===========================
// CREATE
// ===========================
export const createMovie = async (db: SQLiteDatabase, data: Movie) => {
  const now = Date.now();

  await db.runAsync(
    `INSERT INTO movies (title, year, watched, rating, created_at)
      VALUES (?, ?, ?, ?, ?)`,
    [
      data.title,
      data.year ?? null,
      data.watched ?? 0,
      data.rating ?? null,
      now,
    ]
  );
};

// ===========================
// READ
// ===========================
export const getAll = async (db: SQLiteDatabase, isDeleted: number) => {
  return await db.getAllAsync<Movie>(
    `SELECT * FROM movies WHERE isDeleted = ? ORDER BY created_at DESC`,
    [isDeleted]
  );
};

export const getById = async (db: SQLiteDatabase, id: number) => {
  return await db.getFirstAsync<Movie>(
    `SELECT * FROM movies WHERE id = ?`,
    [id]
  );
};

// ===========================
// UPDATE
// ===========================
export const updateMovie = async (db: SQLiteDatabase, data: Movie) => {
  await db.runAsync(
    `UPDATE movies
      SET title = ?, year = ?, rating = ?
      WHERE id = ?`,
    [
      data.title,
      data.year ?? null,
      data.rating ?? null,
      data.id,
    ]
  );
};

// ===========================
// TOGGLE WATCHED (extra function theo đề Movie Watchlist)
// ===========================
export const toggleWatched = async (
  db: SQLiteDatabase,
  id: number,
  currentValue: number
) => {
  const next = currentValue ? 0 : 1;

  await db.runAsync(
    `UPDATE movies SET watched = ? WHERE id = ?`,
    [next, id]
  );
};

// ===========================
// DELETE (SOFT DELETE như file mẫu)
// ===========================
export const softDeleteMovie = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(
    `UPDATE movies SET isDeleted = 1 WHERE id = ?`,
    [id]
  );
};

export const restoreMovie = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(
    `UPDATE movies SET isDeleted = 0 WHERE id = ?`,
    [id]
  );
};
