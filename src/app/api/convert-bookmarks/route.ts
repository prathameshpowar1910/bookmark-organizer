import { NextRequest } from "next/server";
import cheerio, { Cheerio, Element } from "cheerio";

interface Bookmark {
  title?: string;
  url?: string; // Optional because not all bookmarks may have URLs (e.g., folders)
  children?: Bookmark[]; // Optional to handle nested bookmarks
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response('Please select a file to upload', { status: 400 });
    }

    console.log('File uploaded:', file);
    // Handle potential file type issues
    if (typeof file !== 'object' || !('type' in file)) {
      return new Response('Invalid file uploaded. Please select an HTML file.', { status: 400 });
    }

    // Check for expected file type (HTML)
    if (file.type !== 'text/html') {
      return new Response('Please upload an HTML file.', { status: 400 });
    }

    let fileData; // Declare variable to hold processed file content

    if (file instanceof Blob) { // For Blob type files
      fileData = await file.arrayBuffer();
    } else if (typeof file === 'string') { // For string type files (potential edge case)
      fileData = new TextEncoder().encode(file).buffer; // Convert string to arrayBuffer
    } else {
      // Handle unexpected file type (shouldn't reach this point with proper checks)
      return new Response('Unexpected file type encountered.', { status: 500 });
    }

    const data = Buffer.from(fileData).toString('utf-8');

    // Parse HTML content using Cheerio
    const $ = cheerio.load(data);
    const bookmarks: Bookmark[] = [];

    // Recursive function to extract bookmarks and folders
    const extractBookmarks = function (elements: Cheerio<Element>) {
      elements.each((index: any, element: any) => {
        const bookmark: Bookmark = {}; // Provide type annotation for bookmark object
    
        // Extract title from children, remove newlines, and trim
        bookmark.title = $(element)
          .children()
          .text()
          .replace(/\n/g, '')
          .trim();
    
        // Check for nested folders (DT elements)
        const nestedElements = $(element).find('DT');
        if (nestedElements.length) {
          bookmark.children = [];
          extractBookmarks(nestedElements); // Recursively process nested folders
        } else {
          // Extract URL from anchor tag (assuming URL is within anchor)
          const anchor = $(element).find('A');
          bookmark.url = anchor.attr('href');
        }
    
        bookmarks.push(bookmark);
      });
    }

    extractBookmarks($('DT')); // Start extraction from top-level folders
    // console.log('Extracted bookmarks:', bookmarks);
    // Return extracted bookmarks as JSON in the response
    return new Response(JSON.stringify(bookmarks, null, 2), {
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
