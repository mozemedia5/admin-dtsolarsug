import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function ImageInput({ value, onChange, label = "Image", placeholder, required }: ImageInputProps) {
  const [imageUrl, setImageUrl] = useState(value);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageValid, setImageValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  // Validate image URL
  const validateImageUrl = (url: string) => {
    if (!url) {
      setImageError(false);
      setImageValid(false);
      setImageLoading(false);
      return;
    }

    setImageLoading(true);
    setImageError(false);
    
    const img = new Image();
    img.onload = () => {
      setImageError(false);
      setImageValid(true);
      setImageLoading(false);
      setPreviewUrl(url);
      onChange(url);
    };
    img.onerror = () => {
      setImageError(true);
      setImageValid(false);
      setImageLoading(false);
    };
    img.src = url;
  };

  // Handle URL input
  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    validateImageUrl(url);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError(true);
      return;
    }

    setSelectedFile(file);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setImageError(false);
      setImageValid(true);
      // For now, we'll use the data URL. In production, you'd upload to storage
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text.startsWith('http')) {
      handleUrlChange(text);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-slate-300">{label}</Label>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="url" className="data-[state=active]:bg-slate-700">
            <LinkIcon className="w-4 h-4 mr-2" />
            Image URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-slate-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-3">
          <div className="space-y-2">
            <Input
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              onPaste={handlePaste}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder={placeholder || "https://example.com/image.jpg or /images/product.jpg"}
              required={required}
            />
            <p className="text-xs text-slate-400">
              Supports: Facebook, Instagram, Pinterest, Ideogram, Imgur, or any direct image URL
            </p>
          </div>

          {imageLoading && (
            <Alert className="bg-slate-800 border-slate-700">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-slate-300">
                Loading image...
              </AlertDescription>
            </Alert>
          )}

          {imageError && imageUrl && (
            <Alert className="bg-slate-800 border-red-500">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-300">
                Failed to load image. Please check the URL or try a different image.
              </AlertDescription>
            </Alert>
          )}

          {imageValid && !imageLoading && (
            <Alert className="bg-slate-800 border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-300">
                Image loaded successfully!
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-3">
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-slate-800 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
            />
            <p className="text-xs text-slate-400 mt-2">
              Select an image from your device (JPG, PNG, GIF, WebP)
            </p>
          </div>

          {selectedFile && (
            <Alert className="bg-slate-800 border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-300">
                File selected: {selectedFile.name}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {previewUrl && (imageValid || selectedFile) && (
        <div className="mt-4 space-y-2">
          <Label className="text-slate-300">Preview</Label>
          <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => {
                setImageError(true);
                setImageValid(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
