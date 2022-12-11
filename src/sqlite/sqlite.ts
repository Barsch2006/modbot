/**
 * @author Oliver Zimmpasser
 * @description https://github.com/oglimmer
 */
import sqlite3, { RunResult } from 'sqlite3'

/**
 * AsyncDatabase extends the sqlite3.Database with methods returning a Promise
 */
export class AsyncDatabase extends sqlite3.verbose().Database {
  static async open (filename: string, mode?: number): Promise<AsyncDatabase> {
    if (mode === undefined) {
      mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    } else if (typeof mode !== 'number') {
      throw new TypeError('Database.open: mode is not a number')
    }
    return await new Promise<AsyncDatabase>((resolve, reject) => {
      const db = new AsyncDatabase(filename, mode, (err) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(db)
        }
      })
    })
  }

  async allAsync (sql: string, params: any): Promise<any[]> {
    return await new Promise((resolve, reject) => {
      const callback = (err: Error | null, rows: any[]): void => {
        if (err != null) {
          reject(err)
        } else {
          resolve(rows)
        }
      }
      this.all(sql, params, callback)
    })
  }

  async getAsync (sql: string, params: any): Promise<any> {
    return await new Promise((resolve, reject) => {
      const callback = (err: Error | null, rows: any[]): void => {
        if (err != null) {
          reject(err)
        } else {
          resolve(rows)
        }
      }
      this.get(sql, params, callback)
    })
  }

  async runAsync (sql: string): Promise<RunResult>
  async runAsync (sql: string, params: any): Promise<RunResult>

  async runAsync (sql: string, params?: any): Promise<RunResult> {
    return await new Promise((resolve, reject) => {
      function callback (this: RunResult, err: Error | null): void {
        if (err != null) {
          reject(err)
        } else {
          resolve(this)
        }
      }
      if (params !== undefined) {
        this.run(sql, params, callback)
      } else {
        this.run(sql, callback)
      }
    })
  }

  async serializeAsync (callback?: () => Promise<void>): Promise<void> {
    this.serialize(callback)
  }
}
