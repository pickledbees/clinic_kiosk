const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGODB_URL;

async function getClinicDataFromDB(venueId) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const clinicApiCollection = client.db("clinics").collection("clinic_api");
  const { _id, ...clinic } = await clinicApiCollection.findOne({ venueId });
  await client.close();
  return clinic;
}

module.exports = getClinicDataFromDB;
