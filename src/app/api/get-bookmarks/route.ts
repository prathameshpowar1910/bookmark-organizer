import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import { auth } from "@clerk/nextjs/server";

interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkData {
  id: string;
  userBookmarks: Bookmark[];
}

export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const q = query(collection(db, "bookmarkCollection"), where("userID", "==", userId));

  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return NextResponse.json({ bookmarks: null, status: 404 });
  }

  const doc = querySnapshot.docs[0];
  const bookmarks: BookmarkData = {
    id: doc.id,
    userBookmarks: (doc.data().bookmarks as Bookmark[]) || []
  };
  return NextResponse.json({ bookmarks, status: 200 });
}