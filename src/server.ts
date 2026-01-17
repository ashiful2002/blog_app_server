import app from "./lib/app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 2000;
async function main() {
  try {
    await prisma.$connect();
    console.log("connedted to the database successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("An error occured", error);
  }
}
main();
