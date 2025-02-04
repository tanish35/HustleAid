import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";

interface DocumentUploadProps {
  label: string;
  onImageUpload: (file: File) => void;
  currentImage?: string;
}

export const DocumentUpload = ({ label, onImageUpload, currentImage }: DocumentUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(currentImage || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <Card className="border-dashed relative">
        <CardContent className="p-4">
          {fileName ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{fileName}</span>
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {previewUrl && (
                <div className="relative w-full aspect-[16/9] max-h-[400px]">
                  {fileName.toLowerCase().endsWith('.pdf') ? (
                    <embed 
                      src={previewUrl} 
                      type="application/pdf" 
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload {label}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
