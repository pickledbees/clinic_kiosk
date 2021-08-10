const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGODB_URL;
const MONGO_COLLECTION = process.env.MONGODB_COLLECTION;
const MONGO_DB = process.env.MONGODB_DB;

async function getClinicDataFromDB(venueId) {
  const client = new MongoClient(MONGO_URI);

  await client.connect();

  const clinicApiCollection = client.db(MONGO_DB).collection(MONGO_COLLECTION);
  const { _id, ...clinic } = await clinicApiCollection.findOne({ venueId });

  await client.close();

  return clinic;
}

module.exports = getClinicDataFromDB;
