"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useRouter } from 'next/navigation';


export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]); // Access the first selected file
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/convert-bookmarks', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Error uploading file:', response.statusText);
        return;
      }
      const data = await response.json();
      // console.log('Upload successful:', data);
      if (data.length > 0) {
        console.log('Extracted bookmarks:', data);
      }
      router.push('/bookmarks');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <div className="flex h-screen items-center justify-center"> {/* Center the component vertically and horizontally */}
      <Card className="w-full max-w-md"> {/* Set maximum width for responsiveness */}
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" placeholder="File" accept="text/html" onChange={handleFileChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={handleUpload}>Upload</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
