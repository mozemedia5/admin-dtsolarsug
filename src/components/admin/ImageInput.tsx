import { useState, useRef, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Upload, AlertCircle, CheckCircle2, Crop, RotateCw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical, RefreshCw, Wand2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Remove background from image using canvas-based edge detection
 * This is a client-side implementation that works with solid backgrounds
 */
function removeBackgroundFromImage(imageData: ImageData, tolerance: number = 30): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Get the background color (from corner pixel)
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  
  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is similar to background color
    if (
      Math.abs(r - bgR) < tolerance &&
      Math.abs(g - bgG) < tolerance &&
      Math.abs(b - bgB) < tolerance
    ) {
      // Make it transparent
      data[i + 3] = 0;
    }
  }
  
  return imageData;
}

export function ImageInput({ value, onChange, label = "Image", placeholder, required }: ImageInputProps) {
  const [imageError, setImageError] = useState(false);
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
  const [removeBgMode, setRemoveBgMode] = useState(false);
  const [bgRemovalTolerance, setBgRemovalTolerance] = useState(30);
  const [crop, setCrop] = useState<CropState>({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState('');

  const editorCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Render editor canvas whenever transform state changes
  useEffect(() => {
    if (!editorOpen || !resolvedUrl) return;
    renderEditorCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorOpen, zoom, rotation, flipH, flipV, resolvedUrl, removeBgMode, bgRemovalTolerance]);

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

      // Apply background removal if enabled
      if (removeBgMode) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const processedData = removeBackgroundFromImage(imageData, bgRemovalTolerance);
        ctx.putImageData(processedData, 0, 0);
      }
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
  }, [resolvedUrl, zoom, rotation, flipH, flipV, removeBgMode, bgRemovalTolerance]);

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

    const dataUrl = finalCanvas.toDataURL('image/png', 0.92);
    setPreviewUrl(dataUrl);
    setResolvedUrl(dataUrl);
    onChange(dataUrl);
    setImageValid(true);
    setEditorOpen(false);
    setCropMode(false);
    setRemoveBgMode(false);
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
    setRemoveBgMode(false);
    setBgRemovalTolerance(30);
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
        if (resizeHandle.includes('w')) {
          const newWidth = Math.max(10, width - dx);
          x = Math.max(0, x + (width - newWidth));
          width = newWidth;
        }
        if (resizeHandle.includes('n')) {
          const newHeight = Math.max(10, height - dy);
          y = Math.max(0, y + (height - newHeight));
          height = newHeight;
        }
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
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      
      {imageError && (
        <Alert variant="destructive" className="bg-red-950/50 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid image file</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-400 mb-2">Click to upload image</p>
          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {imageValid && previewUrl && (
        <div className="space-y-2">
          <div className="relative bg-slate-800 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-48 object-contain"
            />
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditorOpen(true)}
            className="w-full border-slate-700 text-slate-300"
          >
            Edit Image
          </Button>
        </div>
      )}

      {/* Image Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Canvas Preview */}
            <div className="bg-slate-800 rounded-lg p-4 flex justify-center">
              <canvas
                ref={editorCanvasRef}
                className="max-w-full border border-slate-700 rounded"
              />
            </div>

            {/* Crop Preview Overlay */}
            {cropMode && (
              <div
                className="relative bg-slate-800 rounded-lg overflow-hidden"
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                <canvas
                  ref={editorCanvasRef}
                  className="w-full"
                />
                <div
                  className="absolute border-2 border-orange-400 bg-orange-500/10 cursor-move"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`
                  }}
                  onMouseDown={(e) => handleCropMouseDown(e, 'move')}
                >
                  {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(handle => {
                    const pos: Record<string, any> = {
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

            {/* Background Removal */}
            {removeBgMode && (
              <div className="space-y-2 bg-slate-800 p-3 rounded border border-slate-700">
                <Label className="text-slate-300 text-sm flex items-center gap-1">
                  <Wand2 className="w-4 h-4" /> Background Removal Tolerance: {bgRemovalTolerance}
                </Label>
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={[bgRemovalTolerance]}
                  onValueChange={([v]) => setBgRemovalTolerance(v)}
                  className="w-full"
                />
                <p className="text-xs text-slate-400">Lower values = more precise, Higher values = more removal</p>
              </div>
            )}

            {/* Flip & Crop buttons */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant={flipH ? "default" : "outline"}
                onClick={() => setFlipH(v => !v)}
                className={flipH ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <FlipHorizontal className="w-4 h-4 mr-1" /> Flip H
              </Button>
              <Button type="button" size="sm" variant={flipH ? "default" : "outline"}
                onClick={() => setFlipV(v => !v)}
                className={flipV ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <FlipVertical className="w-4 h-4 mr-1" /> Flip V
              </Button>
              <Button type="button" size="sm" variant={cropMode ? "default" : "outline"}
                onClick={() => setCropMode(v => !v)}
                className={cropMode ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <Crop className="w-4 h-4 mr-1" /> {cropMode ? 'Crop ON' : 'Crop'}
              </Button>
              <Button type="button" size="sm" variant={removeBgMode ? "default" : "outline"}
                onClick={() => setRemoveBgMode(v => !v)}
                className={removeBgMode ? "bg-orange-500 hover:bg-orange-600" : "border-slate-700 text-slate-300"}>
                <Wand2 className="w-4 h-4 mr-1" /> {removeBgMode ? 'BG Remove ON' : 'Remove BG'}
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

            {removeBgMode && (
              <p className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/30">
                Background removal works best with solid-colored backgrounds. Adjust tolerance for better results.
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
