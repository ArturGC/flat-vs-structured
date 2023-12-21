const { MongoClient } = require('mongodb');

class Mongo {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27018');
    this.db = this.client.db('flat_vs_structured');
    this.collections = this.getCollections();
  }

  getCollections = () => {
    return {
      flat: this.db.collection('flat'),
      structured: this.db.collection('structured'),
    };
  };

  dropCollections = async () => {
    for (const collection of Object.values(this.collections)) {
      await collection.drop().catch(() => {});
    }
  };

  close = async () => this.client.close();
}

module.exports = new Mongo();
