"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkData {
  id: string;
  userBookmarks: Bookmark[];
}

export default function Bookmark() {

  const [bookmarkData, setBookmarkData] = useState<BookmarkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/get-bookmarks");
        const data = await response.json();
        setBookmarkData(data.bookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);
    
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Bookmarks</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="w-full h-48">
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookmarks</h1>
      {bookmarkData && bookmarkData.userBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkData.userBookmarks.map((bookmark, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{bookmark.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate mb-4">{bookmark.url}</p>
                <Button asChild variant="outline">
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                    Visit <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don&apos;t have any bookmarks yet. Start adding some to see them here!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}