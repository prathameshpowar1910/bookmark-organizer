"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkData {
  id: string;
  userBookmarks: Bookmark[];
}

const ITEMS_PER_PAGE = 9;

export default function Bookmark() {
  const [bookmarkData, setBookmarkData] = useState<BookmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const filteredBookmarks = bookmarkData?.userBookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = filteredBookmarks
    ? Math.ceil(filteredBookmarks.length / ITEMS_PER_PAGE)
    : 0;

  const paginatedBookmarks = filteredBookmarks?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Wider container */}
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookmarks</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mx-auto"
        />
      </div>
      {paginatedBookmarks && paginatedBookmarks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"> {/* Increased gap */}
            {paginatedBookmarks.map((bookmark, index) => (
              <Card key={index} className="min-w-[300px]"> {/* Minimum width for cards */}
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isActive={currentPage !== 1}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <PaginationEllipsis key={index} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isActive={currentPage !== totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Bookmarks Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {searchTerm
                ? "No bookmarks match your search. Try a different term."
                : "You don't have any bookmarks yet. Start adding some to see them here!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}