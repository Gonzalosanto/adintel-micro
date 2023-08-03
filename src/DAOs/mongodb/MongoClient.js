import { MongoClient } from "mongodb";

export class MongoDBConnection {
  constructor(uri, options) {
    this.uri = uri;
    this.MONGO_OPTIONS = options;
    this.pool = null;
  }

  async connect(db_name) {
    try {
      if (!this.pool) {
        this.pool = new MongoClient(this.uri,{ ...this.MONGO_OPTIONS, useNewUrlParser: true, useUnifiedTopology: true});
        await this.pool.connect();
      }
      if (this.pool) {
        return this.pool.db(db_name);
      }
      throw new Error(`Failed to connect to MongoDB`);
    } catch (err) {
      throw new Error(`Failed to connect to MongoDB: ${err}`);
    }
  }

  async disconnect() {
    try {
      if (this.pool && this.pool.isConnected()) {
        await this.pool.close();
      }
    } catch (err) {
      throw new Error(`Failed to disconnect from MongoDB: ${err}`);
    }
  }

  getPool() {
    return this.pool;
  }
}
