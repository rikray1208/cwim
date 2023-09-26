import { Datatypes, TableNames } from '../types'

export class DBModel {
  static name: TableNames
  static primaryKey: { key: string; type: Datatypes }
  static scheme = {}

  static generateSqlRoutes() {
    const rows: string[] = []
    const foreginKeyRows: string[] = []

    // if (this.generatePrimaryKey) rows.push(`id INTEGER PRIMARY KEY AUTOINCREMENT`)

    for (const [key, value] of Object.entries<any>(this.scheme)) {
      const row = `
        ${key}
        ${value.type}
        ${value.attributes && value.attributes.length > 0 ? value.attributes.join(' ') : ''}
        ${value.default !== undefined ? `DEFAULT ${value.default}` : ''}
      `
      rows.push(this.deleteLinebreaks(row))

      if (value.foreginKey) {
        foreginKeyRows.push(
          `FOREIGN KEY (${key}) REFERENCES ${value.foreginKey.tableName}(${value.foreginKey.key})`
        )
      }
    }
    if (foreginKeyRows !== null) rows.push(...foreginKeyRows)

    return rows
  }
  static deleteLinebreaks(row: string) {
    return row.replace(/\n/g, '').replace(/\s+/g, ' ').trim()
  }
}
