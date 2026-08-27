import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'motion/react';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Max dimensions for the final avatar
    const MAX_SIZE = 256;
    let finalWidth = pixelCrop.width;
    let finalHeight = pixelCrop.height;

    if (finalWidth > MAX_SIZE || finalHeight > MAX_SIZE) {
      if (finalWidth > finalHeight) {
        finalHeight = Math.round((finalHeight * MAX_SIZE) / finalWidth);
        finalWidth = MAX_SIZE;
      } else {
        finalWidth = Math.round((finalWidth * MAX_SIZE) / finalHeight);
        finalHeight = MAX_SIZE;
      }
    }

    // Set canvas size to match the desired crop size
    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      finalWidth,
      finalHeight
    );

    // As Base64 string
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4" style={{ zIndex: 100 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-cyber-card border border-white/10 rounded-3xl p-5 md:p-6 w-full max-w-md flex flex-col shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Crop Profile Image</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-48 md:h-64 bg-black/50 rounded-xl overflow-hidden mb-6">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <ZoomOut className="w-5 h-5 text-white/50" />
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(Number(e.target.value))
            }}
            className="w-full accent-cyber-blue"
          />
          <ZoomIn className="w-5 h-5 text-white/50" />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-cyber-blue text-black font-bold py-3 rounded-xl hover:bg-cyber-blue/80 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
