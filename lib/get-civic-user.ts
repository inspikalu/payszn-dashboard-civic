import { getUser } from "@civic/auth/nextjs";

export async function getCivicUser() {
  try {
    const user = await getUser();
    return user;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
