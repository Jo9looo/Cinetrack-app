import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/db.js';
import {
  WatchlistItem,
  WatchlistStatus,
  CreateWatchlistDTO,
  WatchlistStats,
} from '../types/watchlist.js';
import { AppError } from '../middlewares/errorHandler.js';

interface WatchlistRow extends RowDataPacket, WatchlistItem {}

interface StatusCountRow extends RowDataPacket {
  status: WatchlistStatus;
  count: number;
}

class WatchlistService {
  /**
   * Retrieve all items in the user's watchlist, optionally filtered by viewing status.
   */
  async getAll(statusFilter?: WatchlistStatus): Promise<WatchlistItem[]> {
    let sql = 'SELECT * FROM watchlist';
    const params: any[] = [];

    if (statusFilter) {
      sql += ' WHERE status = ?';
      params.push(statusFilter);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute<WatchlistRow[]>(sql, params);
    return rows;
  }

  /**
   * Find a watchlist record by its primary key ID.
   */
  async getById(id: number): Promise<WatchlistItem | null> {
    const [rows] = await pool.execute<WatchlistRow[]>(
      'SELECT * FROM watchlist WHERE id = ?',
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find a watchlist record by TMDB movie ID.
   */
  async getByTmdbId(tmdbId: number): Promise<WatchlistItem | null> {
    const [rows] = await pool.execute<WatchlistRow[]>(
      'SELECT * FROM watchlist WHERE tmdb_id = ?',
      [tmdbId]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Add a movie to the watchlist using parameterized query.
   */
  async add(item: CreateWatchlistDTO): Promise<WatchlistItem> {
    // Check if the movie already exists in the watchlist
    const existing = await this.getByTmdbId(item.tmdbId);
    if (existing) {
      throw new AppError('This movie is already in your watchlist.', 409);
    }

    const status: WatchlistStatus = item.status || 'Want to Watch';
    const sql = `
      INSERT INTO watchlist (tmdb_id, title, poster_path, release_date, rating, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [
      item.tmdbId,
      item.title,
      item.posterPath || null,
      item.releaseDate || null,
      item.rating !== undefined ? item.rating : null,
      status,
    ]);

    const created = await this.getById(result.insertId);
    if (!created) {
      throw new AppError('Failed to retrieve newly created watchlist item.', 500);
    }

    return created;
  }

  /**
   * Update the viewing status of an existing watchlist item.
   */
  async updateStatus(id: number, status: WatchlistStatus): Promise<WatchlistItem> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new AppError(`Watchlist entry with ID ${id} was not found.`, 404);
    }

    await pool.execute(
      'UPDATE watchlist SET status = ? WHERE id = ?',
      [status, id]
    );

    const updated = await this.getById(id);
    return updated!;
  }

  /**
   * Delete a movie from the watchlist by ID.
   */
  async remove(id: number): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new AppError(`Watchlist entry with ID ${id} was not found.`, 404);
    }

    await pool.execute('DELETE FROM watchlist WHERE id = ?', [id]);
  }

  /**
   * Calculate live statistics for the watchlist directly from database records.
   */
  async getStats(): Promise<WatchlistStats> {
    const [rows] = await pool.execute<StatusCountRow[]>(
      'SELECT status, COUNT(*) AS count FROM watchlist GROUP BY status'
    );

    const stats: WatchlistStats = {
      total: 0,
      wantToWatch: 0,
      watching: 0,
      watched: 0,
    };

    for (const row of rows) {
      const count = Number(row.count);
      stats.total += count;

      if (row.status === 'Want to Watch') {
        stats.wantToWatch = count;
      } else if (row.status === 'Watching') {
        stats.watching = count;
      } else if (row.status === 'Watched') {
        stats.watched = count;
      }
    }

    return stats;
  }
}

export const watchlistService = new WatchlistService();
