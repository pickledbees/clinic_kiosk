const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGODB_URL;
const MONGO_COLLECTION = process.env.MONGODB_COLLECTION;

async function getClinicDataFromDB(venueId) {
  let client;
  try {
    client = new MongoClient(MONGO_URI);
  } catch (e) {
    throw MONGO_URI;
  }
  try {
    await client.connect();
  } catch (e) {
    throw 2;
  }

  let clinicApiCollection;
  try {
    clinicApiCollection = client.db("clinics").collection(MONGO_COLLECTION);
  } catch (e) {
    throw 3;
  }

  let c;
  try {
    const { _id, ...clinic } = await clinicApiCollection.findOne({ venueId });
    c = clinic;
  } catch (e) {
    throw 4;
  }
  await client.close();
  return c;
}

module.exports = getClinicDataFromDB;
