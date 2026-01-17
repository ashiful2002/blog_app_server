import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("****** checking admin data");

    const adminData = {
      name: "admin2 admin",
      email: "admi21@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    console.log("****** admin creation successfull");

    // check user exists or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exists!");
    }
    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin.ok) {
      console.log("****** admin created");

      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("****** admin verification conpleted");
    }
    console.log("****** success");

    console.log(signUpAdmin);
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
