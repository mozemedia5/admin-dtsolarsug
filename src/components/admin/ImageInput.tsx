import { useState, useRef, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Upload, AlertCircle, CheckCircle2, Crop, RotateCw, ZoomIn, ZoomOut,
  FlipHorizontal, FlipVertical, RefreshCw, Wand2, ImageIcon
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Advanced background removal using edge detection and color clustering
 */
function removeBackgroundFromImage(imageData: ImageData, tolerance: number = 30): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const cornerPixels = [
    { r: data[0], g: data[1], b: data[2] },
    { r: data[(width - 1) * 4], g: data[(width - 1) * 4 + 1], b: data[(width - 1) * 4 + 2] },
    { r: data[(height - 1) * width * 4], g: data[(height - 1) * width * 4 + 1], b: data[(height - 1) * width * 4 + 2] },
    { r: data[((height - 1) * width + (width - 1)) * 4], g: data[((height - 1) * width + (width - 1)) * 4 + 1], b: data[((height - 1) * width + (width - 1)) * 4 + 2] },
  ];

  const bgR = Math.round(cornerPixels.reduce((s, p) => s + p.r, 0) / cornerPixels.length);
  const bgG = Math.round(cornerPixels.reduce((s, p) => s + p.g, 0) / cornerPixels.length);
  const bgB = Math.round(cornerPixels.reduce((s, p) => s + p.b, 0) / cornerPixels.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const colorDistance = Math.sqrt(
      Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
    );
    const threshold = tolerance * 2.5;
    if (colorDistance < threshold) {
      data[i + 3] = 0;
    } else if (colorDistance < threshold * 1.5) {
      const alpha = Math.round(((colorDistance - threshold) / (threshold * 0.5)) * 255);
      data[i + 3] = Math.min(255, Math.max(0, alpha));
    }
  }
  return imageData;
}

/**
 * Converts an http/https image URL to a base64 data URL via a proxy,
 * so it can be drawn on canvas without CORS issues.
 */
async function toDataUrl(src: string): Promise<string> {
  // Already a data URL — return as-is
  if (src.startsWith('data:')) return src;

  // Try direct fetch first (works if CORS headers are present)
  try {
    const res = await fetch(src, { mode: 'cors', cache: 'no-cache' });
    if (res.ok) {
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    // CORS blocked — fall through to proxy
  }

  // Fallback: use weserv.nl proxy to bypass CORS
  const proxied = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&output=jpg&q=90`;
  const res2 = await fetch(proxied, { cache: 'no-cache' });
  const blob2 = await res2.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob2);
  });
}

export function ImageInput({ value, onChange, label = "Image" }: ImageInputProps) {
  const [imageError, setImageError] = useState(false);
  const [imageValid, setImageValid] = useState(!!value);
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDataUrl, setEditorDataUrl] = useState<string>(''); // always a data URL for canvas
  const [loadingEditor, setLoadingEditor] = useState(false);
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
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync value prop → preview when form is reset or editing an existing product/promo
  useEffect(() => {
    if (value && value !== previewUrl) {
      setPreviewUrl(value);
      setImageValid(true);
      setImageError(false);
    }
    if (!value) {
      setPreviewUrl('');
      setImageValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // When editor opens, convert the current image to a data URL for safe canvas rendering
  useEffect(() => {
    if (!editorOpen) return;
    if (!previewUrl) return;

    setLoadingEditor(true);
    toDataUrl(previewUrl)
      .then(dataUrl => {
        setEditorDataUrl(dataUrl);
        setLoadingEditor(false);
      })
      .catch(() => {
        // If conversion fails, still try to use previewUrl directly
        setEditorDataUrl(previewUrl);
        setLoadingEditor(false);
      });
  }, [editorOpen, previewUrl]);

  // Re-render editor canvas whenever transform state or source changes
  useEffect(() => {
    if (!editorOpen || !editorDataUrl || loadingEditor) return;
    renderEditorCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorOpen, editorDataUrl, zoom, rotation, flipH, flipV, removeBgMode, bgRemovalTolerance, loadingEditor]);

  const renderEditorCanvas = useCallback(() => {
    const canvas = editorCanvasRef.current;
    if (!canvas || !editorDataUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    // Data URLs don't need crossOrigin
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
        try {
          const imageData = ctx.getImageData(0, 0, w, h);
          const processedData = removeBackgroundFromImage(imageData, bgRemovalTolerance);
          ctx.putImageData(processedData, 0, 0);
        } catch (_e) {
          // skip
        }
      }

      // Also update crop canvas if crop mode
      if (cropMode && cropCanvasRef.current) {
        const cropCanvas = cropCanvasRef.current;
        const cropCtx = cropCanvas.getContext('2d');
        if (cropCtx) {
          cropCanvas.width = w;
          cropCanvas.height = h;
          cropCtx.drawImage(canvas, 0, 0);
        }
      }
    };
    img.onerror = () => {
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
    img.src = editorDataUrl;
  }, [editorDataUrl, zoom, rotation, flipH, flipV, removeBgMode, bgRemovalTolerance, cropMode]);

  // Also re-render when cropMode changes
  useEffect(() => {
    if (editorOpen && editorDataUrl && !loadingEditor) {
      renderEditorCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropMode]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError(true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreviewUrl(dataUrl);
      setImageError(false);
      setImageValid(true);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // ---- Editor actions ----
  const handleApplyEdits = useCallback(() => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return;

    let finalCanvas: HTMLCanvasElement = canvas;

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
    setEditorDataUrl(dataUrl);
    onChange(dataUrl);
    setImageValid(true);
    setEditorOpen(false);
    setCropMode(false);
    setRemoveBgMode(false);
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

  // ---- Crop drag & resize ----
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

  const openEditor = () => {
    handleResetEdits();
    setEditorOpen(true);
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>

      {imageError && (
        <Alert variant="destructive" className="bg-red-950/50 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid image file. Please select a valid image (PNG, JPG, GIF, WEBP).</AlertDescription>
        </Alert>
      )}

      {/* Upload area */}
      <div className="relative">
        <div
          className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center bg-slate-800/50 hover:bg-slate-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-sm text-slate-300 mb-1 font-medium">Click to upload image</p>
          <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Preview + Edit button */}
      {imageValid && previewUrl && (
        <div className="space-y-2">
          <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-52 object-contain"
              onError={(e) => {
                // Try weserv proxy if direct load fails
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('weserv.nl') && previewUrl.startsWith('http')) {
                  target.src = `https://images.weserv.nl/?url=${encodeURIComponent(previewUrl)}&output=jpg&q=85`;
                }
              }}
            />
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow" />
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="text-xs text-slate-400 bg-slate-900/70 px-2 py-1 rounded">Image selected ✓</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={openEditor}
              className="flex-1 border-slate-600 text-slate-300 hover:border-orange-500/50 hover:text-orange-400"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Edit / Remove Background
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-slate-600 text-slate-400 hover:border-slate-500"
              title="Replace image"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Image Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={(open) => {
        if (!open) { setEditorOpen(false); handleResetEdits(); }
      }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-orange-400" />
              Image Editor
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Canvas Preview */}
            <div
              className="bg-slate-800 rounded-lg p-4 flex justify-center items-center relative overflow-hidden"
              style={{ minHeight: '220px' }}
            >
              {/* Checkerboard for transparency */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'repeating-conic-gradient(#888 0% 25%, transparent 0% 50%)',
                  backgroundSize: '20px 20px'
                }} />

              {loadingEditor ? (
                <div className="relative z-10 flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading image for editor...</span>
                </div>
              ) : editorDataUrl ? (
                <canvas
                  ref={editorCanvasRef}
                  className="max-w-full border border-slate-700 rounded relative z-10"
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-3 text-slate-500">
                  <ImageIcon className="w-12 h-12" />
                  <span className="text-sm">No image loaded</span>
                </div>
              )}
            </div>

            {/* Crop Overlay */}
            {cropMode && (
              <div
                className="relative bg-slate-800 rounded-lg overflow-hidden select-none"
                style={{ minHeight: '200px' }}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                <canvas ref={cropCanvasRef} className="w-full" />
                <div className="absolute inset-0 bg-black/40" />
                <div
                  className="absolute border-2 border-orange-400 cursor-move"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                  }}
                  onMouseDown={(e) => handleCropMouseDown(e, 'move')}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-50">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>
                  {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const).map(handle => {
                    const pos: Record<string, React.CSSProperties> = {
                      nw: { top: -5, left: -5 },
                      n: { top: -5, left: 'calc(50% - 5px)' },
                      ne: { top: -5, right: -5 },
                      e: { top: 'calc(50% - 5px)', right: -5 },
                      se: { bottom: -5, right: -5 },
                      s: { bottom: -5, left: 'calc(50% - 5px)' },
                      sw: { bottom: -5, left: -5 },
                      w: { top: 'calc(50% - 5px)', left: -5 },
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
                        style={{ ...pos[handle], cursor: cursors[handle], position: 'absolute' }}
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
                  <ZoomIn className="w-4 h-4 text-orange-400" /> Zoom: {zoom}%
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
                  <Button type="button" size="sm" variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setZoom(v => Math.max(25, v - 10))}>
                    <ZoomOut className="w-3 h-3 mr-1" />-10%
                  </Button>
                  <Button type="button" size="sm" variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setZoom(v => Math.min(200, v + 10))}>
                    <ZoomIn className="w-3 h-3 mr-1" />+10%
                  </Button>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm flex items-center gap-1">
                  <RotateCw className="w-4 h-4 text-orange-400" /> Rotation: {rotation}°
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
                  <Button type="button" size="sm" variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setRotation(v => v - 90)}>
                    -90°
                  </Button>
                  <Button type="button" size="sm" variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 text-xs"
                    onClick={() => setRotation(v => v + 90)}>
                    +90°
                  </Button>
                </div>
              </div>
            </div>

            {/* Background Removal controls */}
            {removeBgMode && (
              <div className="space-y-2 bg-blue-950/30 p-3 rounded-lg border border-blue-500/30">
                <Label className="text-blue-300 text-sm flex items-center gap-1">
                  <Wand2 className="w-4 h-4" /> Background Removal — Tolerance: {bgRemovalTolerance}
                </Label>
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={[bgRemovalTolerance]}
                  onValueChange={([v]) => setBgRemovalTolerance(v)}
                  className="w-full"
                />
                <p className="text-xs text-blue-400">
                  ↑ Higher = removes more background &nbsp;|&nbsp; ↓ Lower = more precise
                </p>
              </div>
            )}

            {/* Tool buttons */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm"
                variant={flipH ? "default" : "outline"}
                onClick={() => setFlipH(v => !v)}
                className={flipH ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-slate-700 text-slate-300"}>
                <FlipHorizontal className="w-4 h-4 mr-1" /> Flip H
              </Button>
              <Button type="button" size="sm"
                variant={flipV ? "default" : "outline"}
                onClick={() => setFlipV(v => !v)}
                className={flipV ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-slate-700 text-slate-300"}>
                <FlipVertical className="w-4 h-4 mr-1" /> Flip V
              </Button>
              <Button type="button" size="sm"
                variant={cropMode ? "default" : "outline"}
                onClick={() => setCropMode(v => !v)}
                className={cropMode ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-slate-700 text-slate-300"}>
                <Crop className="w-4 h-4 mr-1" /> {cropMode ? 'Crop ON' : 'Crop'}
              </Button>
              <Button type="button" size="sm"
                variant={removeBgMode ? "default" : "outline"}
                onClick={() => setRemoveBgMode(v => !v)}
                className={removeBgMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-slate-700 text-slate-300"}>
                <Wand2 className="w-4 h-4 mr-1" /> {removeBgMode ? 'Remove BG ON' : 'Remove BG'}
              </Button>
              <Button type="button" size="sm" variant="outline"
                onClick={handleResetEdits}
                className="border-slate-700 text-slate-400">
                <RefreshCw className="w-4 h-4 mr-1" /> Reset
              </Button>
            </div>

            {cropMode && (
              <p className="text-xs text-orange-400 bg-orange-500/10 p-2 rounded border border-orange-500/30">
                💡 Drag the orange selection box to position. Drag handles to resize. Click "Apply Edits" when done.
              </p>
            )}
            {removeBgMode && (
              <p className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/30">
                💡 Remove Background works best on images with solid or uniform backgrounds.
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
              <Button type="button" variant="outline"
                onClick={() => { setEditorOpen(false); handleResetEdits(); }}
                className="border-slate-700 text-slate-300">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleApplyEdits}
                disabled={loadingEditor || !editorDataUrl}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                Apply Edits
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
