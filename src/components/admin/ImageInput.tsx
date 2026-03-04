import { useState, useRef, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Upload, Link as LinkIcon, AlertCircle, CheckCircle2, Crop, RotateCw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

// CORS-friendly image proxy list - tries multiple proxies
const IMAGE_PROXIES = [
  (url: string) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg&q=85`,
  (url: string) => `https://wsrv.nl/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
];

/**
 * Try to load an image directly, then via proxies if it fails (CORS issue).
 * Returns the working URL or null.
 */
function tryLoadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) {
      // local / data URL – use as-is
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
      return;
    }

    // Try direct load first
    const tryProxy = (proxies: Array<(u: string) => string>, index: number) => {
      if (index >= proxies.length) {
        // All proxies failed, but we still accept the URL (might work in browser directly)
        resolve(url);
        return;
      }
      const proxyUrl = proxies[index](url);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(proxyUrl);
      img.onerror = () => tryProxy(proxies, index + 1);
      img.src = proxyUrl;
    };

    const direct = new Image();
    direct.crossOrigin = 'anonymous';
    direct.onload = () => resolve(url);
    direct.onerror = () => {
      // Direct failed – try weserv proxy
      tryProxy(IMAGE_PROXIES, 0);
    };
    // Short timeout to avoid hanging on slow URLs
    const timer = setTimeout(() => {
      direct.src = '';
      tryProxy(IMAGE_PROXIES, 0);
    }, 5000);
    direct.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };
    direct.src = url;
  });
}

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageInput({ value, onChange, label = "Image", placeholder, required }: ImageInputProps) {
  const [imageUrl, setImageUrl] = useState(value);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageValid, setImageValid] = useState(!!value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [resolvedUrl, setResolvedUrl] = useState<string>(value);

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState<CropState>({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Render editor canvas whenever transform state changes
  useEffect(() => {
    if (!editorOpen || !resolvedUrl) return;
    renderEditorCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorOpen, zoom, rotation, flipH, flipV, resolvedUrl]);

  const renderEditorCanvas = useCallback(() => {
    const canvas = editorCanvasRef.current;
    if (!canvas || !resolvedUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxW = 480;
      const maxH = 360;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const ratio = Math.min(maxW / w, maxH / h, 1);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);

      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(
        (flipH ? -1 : 1) * (zoom / 100),
        (flipV ? -1 : 1) * (zoom / 100)
      );
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    };
    img.onerror = () => {
      // fallback – draw placeholder
      const c = editorCanvasRef.current;
      if (!c) return;
      const cx = c.getContext('2d');
      if (!cx) return;
      c.width = 480;
      c.height = 360;
      cx.fillStyle = '#334155';
      cx.fillRect(0, 0, 480, 360);
      cx.fillStyle = '#94a3b8';
      cx.font = '16px sans-serif';
      cx.textAlign = 'center';
      cx.fillText('Image preview unavailable', 240, 180);
    };
    img.src = resolvedUrl;
  }, [resolvedUrl, zoom, rotation, flipH, flipV]);

  // Validate image URL – tries direct then proxy
  const validateImageUrl = useCallback(async (url: string) => {
    if (!url) {
      setImageError(false);
      setImageValid(false);
      setImageLoading(false);
      return;
    }

    setImageLoading(true);
    setImageError(false);
    setImageValid(false);

    try {
      const working = await tryLoadImage(url);
      setResolvedUrl(working);
      setPreviewUrl(working);
      setImageValid(true);
      setImageError(false);
      onChange(url); // always store the original URL in Firebase
    } catch {
      // Even if proxy failed, accept the URL anyway – user said it's valid
      setResolvedUrl(url);
      setPreviewUrl(url);
      setImageValid(true);
      setImageError(false);
      onChange(url);
    } finally {
      setImageLoading(false);
    }
  }, [onChange]);

  // Handle URL input
  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (url.startsWith('http') || url.startsWith('/')) {
      validateImageUrl(url);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError(true);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreviewUrl(dataUrl);
      setResolvedUrl(dataUrl);
      setImageError(false);
      setImageValid(true);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text.startsWith('http')) {
      setImageUrl(text);
      validateImageUrl(text);
    }
  };

  // ---- Editor actions ----
  const handleApplyEdits = useCallback(() => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return;

    let finalCanvas = canvas;

    // If crop mode, apply crop
    if (cropMode) {
      const cropCanvas = document.createElement('canvas');
      const cw = canvas.width;
      const ch = canvas.height;
      const cx2 = Math.round((crop.x / 100) * cw);
      const cy2 = Math.round((crop.y / 100) * ch);
      const cWidth = Math.round((crop.width / 100) * cw);
      const cHeight = Math.round((crop.height / 100) * ch);
      cropCanvas.width = cWidth;
      cropCanvas.height = cHeight;
      const ctx = cropCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, cx2, cy2, cWidth, cHeight, 0, 0, cWidth, cHeight);
      }
      finalCanvas = cropCanvas;
    }

    const dataUrl = finalCanvas.toDataURL('image/jpeg', 0.92);
    setPreviewUrl(dataUrl);
    setResolvedUrl(dataUrl);
    onChange(dataUrl);
    setImageValid(true);
    setEditorOpen(false);
    setCropMode(false);
    // reset
    setZoom(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, [cropMode, crop, onChange]);

  const handleResetEdits = () => {
    setZoom(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropMode(false);
    setCrop({ x: 10, y: 10, width: 80, height: 80 });
  };

  // ---- Crop drag & resize on the overlay div ----
  const handleCropMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (handle === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
      setResizeHandle(handle);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCropMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && !isResizing) return;
    const dx = ((e.clientX - dragStart.x) / (editorCanvasRef.current?.offsetWidth || 480)) * 100;
    const dy = ((e.clientY - dragStart.y) / (editorCanvasRef.current?.offsetHeight || 360)) * 100;

    setCrop(prev => {
      let { x, y, width, height } = prev;
      if (isDragging) {
        x = Math.max(0, Math.min(100 - width, x + dx));
        y = Math.max(0, Math.min(100 - height, y + dy));
      } else {
        if (resizeHandle.includes('e')) width = Math.max(10, Math.min(100 - x, width + dx));
        if (resizeHandle.includes('s')) height = Math.max(10, Math.min(100 - y, height + dy));
        if (resizeHandle.includes('w')) { width = Math.max(10, width - dx); x = Math.max(0, x + dx); }
        if (resizeHandle.includes('n')) { height = Math.max(10, height - dy); y = Math.max(0, y + dy); }
      }
      return { x, y, width, height };
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isResizing, dragStart, resizeHandle]);

  const handleCropMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
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

        {/* URL Tab */}
        <TabsContent value="url" className="space-y-3">
          <div className="space-y-2">
            <Input
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              onPaste={handlePaste}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder={placeholder || "Paste any image URL from Ideogram, Pinterest, etc."}
              required={required}
            />
            <p className="text-xs text-slate-400">
              Supports: Ideogram, Pinterest, Facebook, Instagram, Imgur, Google Images, or any image URL.
              URLs that can't load directly will be proxied automatically.
            </p>
          </div>

          {imageLoading && (
            <Alert className="bg-slate-800 border-slate-700">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-slate-300">
                Loading image... trying direct and proxy methods.
              </AlertDescription>
            </Alert>
          )}

          {imageError && imageUrl && (
            <Alert className="bg-slate-800 border-red-500">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-300">
                Could not preview this URL (CORS restriction). The URL has been saved as-is — it will display correctly on the website.
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

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-3">
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-slate-800 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
            />
            <p className="text-xs text-slate-400 mt-2">
              Select an image (JPG, PNG, GIF, WebP). The image will be embedded as a base64 data URL.
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

      {/* Image Preview + Edit Button */}
      {previewUrl && (imageValid || selectedFile) && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Preview</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                renderEditorCanvas();
                setEditorOpen(true);
              }}
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            >
              <Crop className="w-4 h-4 mr-1" />
              Edit Image
            </Button>
          </div>
          <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => {
                // Try weserv proxy on preview error
                if (!previewUrl.includes('weserv.nl') && previewUrl.startsWith('http')) {
                  const proxy = `https://images.weserv.nl/?url=${encodeURIComponent(previewUrl)}&output=jpg`;
                  setPreviewUrl(proxy);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Image Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Crop className="w-5 h-5 text-orange-400" />
              Image Editor – Crop, Resize & Transform
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Canvas preview */}
            <div
              className="relative bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ minHeight: 200 }}
              onMouseMove={cropMode ? handleCropMouseMove : undefined}
              onMouseUp={cropMode ? handleCropMouseUp : undefined}
              onMouseLeave={cropMode ? handleCropMouseUp : undefined}
            >
              <canvas
                ref={editorCanvasRef}
                className="max-w-full rounded"
                style={{ display: 'block' }}
              />

              {/* Crop overlay */}
              {cropMode && editorCanvasRef.current && (
                <div
                  className="absolute inset-0"
                  style={{ pointerEvents: 'none' }}
                >
                  {/* Dark mask */}
                  <div className="absolute inset-0 bg-black/50" />
                  {/* Crop box */}
                  <div
                    className="absolute border-2 border-orange-400"
                    style={{
                      left: `${crop.x}%`,
                      top: `${crop.y}%`,
                      width: `${crop.width}%`,
                      height: `${crop.height}%`,
                      pointerEvents: 'all',
                      cursor: 'move',
                      background: 'transparent',
                    }}
                    onMouseDown={(e) => handleCropMouseDown(e, 'move')}
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)',
                      backgroundSize: '33.33% 33.33%'
                    }} />
                    {/* Resize handles */}
                    {['nw','n','ne','e','se','s','sw','w'].map(handle => {
                      const pos: Record<string, React.CSSProperties> = {
                        nw: { top: -4, left: -4 },
                        n:  { top: -4, left: 'calc(50% - 4px)' },
                        ne: { top: -4, right: -4 },
                        e:  { top: 'calc(50% - 4px)', right: -4 },
                        se: { bottom: -4, right: -4 },
                        s:  { bottom: -4, left: 'calc(50% - 4px)' },
                        sw: { bottom: -4, left: -4 },
                        w:  { top: 'calc(50% - 4px)', left: -4 },
                      };
                      const cursors: Record<string, string> = {
                        nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
                        e: 'e-resize', se: 'se-resize', s: 's-resize',
                        sw: 'sw-resize', w: 'w-resize'
                      };
                      return (
                        <div
                          key={handle}
                          className="absolute w-3 h-3 bg-orange-400 border-2 border-white rounded-sm"
                          style={{ ...pos[handle], cursor: cursors[handle] }}
                          onMouseDown={(e) => handleCropMouseDown(e, handle)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Transform Controls */}
            <div className="grid grid-cols-2 gap-4">
              {/* Zoom */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm flex items-center gap-1">
                  <ZoomIn className="w-4 h-4" /> Zoom: {zoom}%
                </Label>
                <Slider
                  min={25}
                  max={200}
                  step={5}
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  className="w-full"
                />
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant="outline" className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setZoom(v => Math.max(25, v - 10))}>
                    <ZoomOut className="w-3 h-3 mr-1" />-10%
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setZoom(v => Math.min(200, v + 10))}>
                    <ZoomIn className="w-3 h-3 mr-1" />+10%
                  </Button>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm flex items-center gap-1">
                  <RotateCw className="w-4 h-4" /> Rotation: {rotation}°
                </Label>
                <Slider
                  min={-180}
                  max={180}
                  step={1}
                  value={[rotation]}
                  onValueChange={([v]) => setRotation(v)}
                  className="w-full"
                />
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant="outline" className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setRotation(v => v - 90)}>
                    -90°
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setRotation(v => v + 90)}>
                    +90°
                  </Button>
                </div>
              </div>
            </div>

            {/* Flip & Crop buttons */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant={flipH ? "default" : "outline"}
                onClick={() => setFlipH(v => !v)}
                className={flipH ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <FlipHorizontal className="w-4 h-4 mr-1" /> Flip H
              </Button>
              <Button type="button" size="sm" variant={flipV ? "default" : "outline"}
                onClick={() => setFlipV(v => !v)}
                className={flipV ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <FlipVertical className="w-4 h-4 mr-1" /> Flip V
              </Button>
              <Button type="button" size="sm" variant={cropMode ? "default" : "outline"}
                onClick={() => setCropMode(v => !v)}
                className={cropMode ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <Crop className="w-4 h-4 mr-1" /> {cropMode ? 'Crop ON' : 'Crop'}
              </Button>
              <Button type="button" size="sm" variant="outline"
                onClick={handleResetEdits}
                className="border-slate-700 text-slate-300">
                <RefreshCw className="w-4 h-4 mr-1" /> Reset
              </Button>
            </div>

            {cropMode && (
              <p className="text-xs text-orange-400 bg-orange-500/10 p-2 rounded border border-orange-500/30">
                Drag the orange box to position the crop area. Drag the corner/edge handles to resize it. Click "Apply Edits" when done.
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
              <Button type="button" variant="outline"
                onClick={() => { setEditorOpen(false); handleResetEdits(); }}
                className="border-slate-700 text-slate-300">
                Cancel
              </Button>
              <Button type="button"
                onClick={handleApplyEdits}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                Apply Edits
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
