import { NextRequest, NextResponse } from "next/server";
import cheerio, { Cheerio, Element } from "cheerio";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { auth, currentUser } from '@clerk/nextjs/server';
export interface Bookmark {
  title?: string;
  url?: string;
}

const convertBookmarks = async (data: string) => {
  const $ = cheerio.load(data);
  const bookmarks: Bookmark[] = [];
  const extractBookmarks = function (elements: Cheerio<Element>) {
    elements.each((index: any, element: any) => {
      const bookmark: Bookmark = {};
      bookmark.title = $(element)
        .children()
        .text()
        .replace(/\n/g, '')
        .trim();
      const nestedElements = $(element).find('DT');
      if (nestedElements.length) {
        extractBookmarks(nestedElements);
      } else {
        const anchor = $(element).find('A');
        bookmark.url = anchor.attr('href');
      }
      if (bookmark.title && bookmark.title.length <= 150 && bookmark.url) {
        bookmarks.push(bookmark);
      }
    });
  }

  extractBookmarks($('DT'));

  // Filter out any bookmarks with undefined values
  const validBookmarks = bookmarks.filter(bookmark =>
    bookmark.title !== undefined && bookmark.url !== undefined
  );

  if (validBookmarks.length === 0) {
    return new Response('No valid bookmarks found', { status: 400 });
  }

  return validBookmarks;
}

export async function POST(request: NextRequest) {
  try {

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return new Response('Please select a file to upload', { status: 400 });
    }
    console.log('File uploaded:', file);
    if (typeof file !== 'object' || !('type' in file)) {
      return new Response('Invalid file uploaded. Please select an HTML file.', { status: 400 });
    }
    if (file.type !== 'text/html') {
      return new Response('Please upload an HTML file.', { status: 400 });
    }
    let fileData;
    if (file instanceof Blob) {
      fileData = await file.arrayBuffer();
    } else if (typeof file === 'string') {
      fileData = new TextEncoder().encode(file).buffer;
    } else {
      return new Response('Unexpected file type encountered.', { status: 500 });
    }

    const data = Buffer.from(fileData).toString('utf-8');
    const validBookmarks = await convertBookmarks(data);

    await addDoc(collection(db, 'bookmarkCollection'), {
      userID: userId,
      bookmarks: validBookmarks
    });

    console.log('Bookmarks added to Firestore');

    return new Response(JSON.stringify(validBookmarks, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    return new Response('An error occurred during processing', { status: 500 });
  }
}