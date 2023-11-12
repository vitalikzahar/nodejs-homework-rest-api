const mongoose = require("mongoose");

const DB_URI =
  "mongodb+srv://admin:AmXDDzOtW8wHteKE@cluster1.smitm3e.mongodb.net/db-contacts?retryWrites=true&w=majority";
async function run() {
  try {
    await mongoose.connect(DB_URI);

    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}
run().catch(console.error);
