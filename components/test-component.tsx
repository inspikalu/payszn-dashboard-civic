import React from "react";
import { UserButton, useUser } from "@civic/auth/react";

const getUser = async () => {
  const user = await fetch("/api/get-user");
  return user.json();
}
function Test() {
  console.log(getUser());
  return (
    <div>
      <UserButton />
    </div>
  );
}

export default Test;
