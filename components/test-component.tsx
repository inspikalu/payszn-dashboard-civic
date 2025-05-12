import React, { useEffect } from "react";
import { UserButton } from "@civic/auth-web3/react";
import { getCivicUser } from "@/lib/get-civic-user";

const getUser = async () => {
  const user = await getCivicUser();
  return user;
};

function Test() {
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchUser = async () => {
      const user = await getUser();
      console.log("Fetched User:", user); // Now logs the resolved user
    };
    fetchUser();
  }, []); // Empty dependency array runs once on mount

  return (
    <div>
      <UserButton />
    </div>
  );
}

export default Test;
