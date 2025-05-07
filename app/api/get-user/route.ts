// app/api/civic-user/route.ts
import { NextResponse } from 'next/server';
import { getUser } from "@civic/auth-web3/nextjs";

export async function GET() {
  try {
    const user = await getUser();
    
    // For security, only return necessary user data
    // const safeUser = {
    //   id: user?.id,
    //   address: user?.address,
    //   verifiedCredentials: user?.verifiedCredentials
    // };

    return NextResponse.json({ user: user });
    
  } catch (error) {
    console.error("Civic auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}