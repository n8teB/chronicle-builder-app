import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Image,
  X,
  Upload,
  MoreVertical,
  Trash2,
  Eye,
  Download,
  Plus,
} from "lucide-react";
import { useState } from "react";

export interface ImageItem {
  id: string;
  url: string;
  filename: string;
  description?: string;
  uploadedAt: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  title?: string;
  description?: string;
}

export function ImageGallery({
  images,
  onImagesChange,
  maxImages = 5,
  title = "Image Gallery",
  description = "Upload images to visualize your content",
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newImage: ImageItem = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: result,
          filename: file.name,
          description: "",
          uploadedAt: new Date().toISOString(),
        };

        onImagesChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  const handleImageDescriptionUpdate = (
    imageId: string,
    description: string,
  ) => {
    onImagesChange(
      images.map((img) => (img.id === imageId ? { ...img, description } : img)),
    );
  };

  const handleImagePreview = (image: ImageItem) => {
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  const handleDownloadImage = (image: ImageItem) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canAddMore = images.length < maxImages;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-5 w-5" />
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {description} ({images.length}/{maxImages})
              </p>
            </div>
            {canAddMore && (
              <div>
                <Label htmlFor="image-upload" className="sr-only">
                  Upload Images
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">
                No images uploaded yet
              </p>
              {canAddMore && (
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.description || image.filename}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleImagePreview(image)}
                    />
                  </div>

                  {/* Image overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => handleImagePreview(image)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleDownloadImage(image)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleImageRemove(image.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* File info badge */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <Badge
                      variant="secondary"
                      className="text-xs truncate w-full justify-center"
                    >
                      {image.filename}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Add more button */}
              {canAddMore && (
                <div
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Add Image</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!canAddMore && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Maximum of {maxImages} images reached
            </p>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              {selectedImage?.filename}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.description || selectedImage.filename}
                  className="w-full max-h-[60vh] object-contain rounded-lg bg-muted"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="image-description">Description</Label>
                  <Input
                    id="image-description"
                    value={selectedImage.description || ""}
                    onChange={(e) =>
                      handleImageDescriptionUpdate(
                        selectedImage.id,
                        e.target.value,
                      )
                    }
                    placeholder="Add a description for this image..."
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Uploaded:{" "}
                    {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadImage(selectedImage)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleImageRemove(selectedImage.id);
                        setPreviewOpen(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
