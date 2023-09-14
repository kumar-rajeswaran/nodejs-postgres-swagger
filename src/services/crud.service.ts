import { sql } from "slonik";
import { _dbContext } from "../configs";
import { IUsers } from "../entities";

export default class CrudService<T extends object> {
  constructor(private tableName: string) {}

  async create<K extends keyof T>(data: T) {
    const columns = Object.keys(data).map((col) => sql.identifier([col]));
    const placeholders = Object.keys(data).map((column) => `${data[column as K]}`);

    const query = sql.unsafe`
      INSERT INTO ${sql.identifier([this.tableName])} (${sql.join(columns, sql.unsafe`, `)})
      VALUES (${sql.join(placeholders, sql.unsafe`, `)})
      RETURNING *
    `;
    console.log({ query });
    try {
      return (await _dbContext).connect(async (connection) => {
        const result = await connection.maybeOne(query);
        if (result) return result as IUsers;
        else return null;
      });
    } catch (error) {
      throw new Error(
        `Error creating data in ${this.tableName}: ${error instanceof Error ? error.message : "An Error Occured!"}`
      );
    }
  }

  async getAll() {
    const query = sql.unsafe`SELECT * FROM ${sql.identifier([this.tableName])}`;

    try {
      return (await _dbContext).connect(async (connection) => {
        const result = await connection.many(query);
        if (result) return result as IUsers[];
        else return null;
      });
    } catch (error) {
      throw new Error(
        `Error fetching data from ${this.tableName}: ${error instanceof Error ? error.message : "An Error Occured!"}`
      );
    }
  }

  async findOne<K extends keyof T>(where: Partial<T>) {
    const conditions = Object.keys(where)
      .map((key) => `${key} = '${where[key as K]}'`)
      .join(" AND ");

    const query = sql.unsafe`SELECT * FROM ${sql.identifier([this.tableName])} WHERE ${sql.fragment([conditions])}`;

    try {
      return (await _dbContext).connect(async (connection) => {
        const result = await connection.maybeOne(query);
        if (result) return result as IUsers;
        else return null;
      });
    } catch (error) {
      throw new Error(
        `Error fetching data from ${this.tableName}: ${error instanceof Error ? error.message : "An Error Occured!"}`
      );
    }
  }

  async findMany<K extends keyof T>(where: Partial<T>) {
    const conditions = Object.keys(where)
      .map((key) => `${key} = '${where[key as K]}'`)
      .join(" AND ");

    const query = sql.unsafe`SELECT * FROM ${sql.identifier([this.tableName])} WHERE ${sql.fragment([conditions])}`;

    try {
      return (await _dbContext).connect(async (connection) => {
        const result = await connection.many(query);
        if (result) return result as IUsers[];
        else return null;
      });
    } catch (error) {
      throw new Error(
        `Error fetching data from ${this.tableName}: ${error instanceof Error ? error.message : "An Error Occured!"}`
      );
    }
  }

  async update<K extends keyof T>(id: number, data: Partial<T>): Promise<void> {
    const updates = Object.keys(data)
      .map((key) => `${key} = '${data[key as K]}'`)
      .join(", ");

    const query = sql.unsafe`
      UPDATE ${sql.identifier([this.tableName])}
      SET ${updates}
      WHERE id = ${id}
    `;

    try {
      (await _dbContext).connect(async (connection) => {
        const result = await connection.query(query);
        return result;
      });
    } catch (error) {
      throw new Error(
        `Error updating data in ${this.tableName}: ${error instanceof Error ? error.message : "An Error Occured!"}`
      );
    }
  }

  async delete(id: number) {
    const query = sql.unsafe`
      DELETE FROM ${sql.identifier([this.tableName])}
      WHERE id = ${id}
    `;

    try {
      (await _dbContext).connect(async (connection) => {
        const result = await connection.query(query);
        return result;
      });
    } catch (error) {
      throw new Error(
        `Error deleting data from ${this.tableName}: ${error instanceof Error ? error.message : "An Error Occured!"}`
      );
    }
  }

  async raw(sqlQuery: string) {
    const query = sql.unsafe`${sqlQuery}`;

    try {
      (await _dbContext).connect(async (connection) => {
        const result = await connection.query(query);
        return result;
      });
    } catch (error) {
      throw new Error(`Error Excuting Query! : ${error instanceof Error ? error.message : "An Error Occured!"}`);
    }
  }
}
