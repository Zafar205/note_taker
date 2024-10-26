import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  auth().protect(); // Ensure the user is authenticated

  const { sessionClaims } = await auth();
  const {room} = await req.json();

  // console.log("Room ID from request:", room);

  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      name: sessionClaims?.fullName!,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image!,
    },
  });


  const usersInRoom = await adminDb
  .collectionGroup("rooms")
  .where("userId", "==", sessionClaims?.email)
  .get();


  //  console.log("Users in room query result:", usersInRoom.docs.map(doc => doc.id));
   const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);
  //  console.log("User in room found:", userInRoom);

if (userInRoom?.exists) {
  session.allow(room, session.FULL_ACCESS);
  const {body, status} = await session.authorize();
  console.log("authorized");
  return new Response(body, { status });

} else {
  return NextResponse.json({
    message: "You are not in this room",
    status: 403,
  });
}
}