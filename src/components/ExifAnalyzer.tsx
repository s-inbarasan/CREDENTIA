import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Aperture as ApertureIcon, 
  Upload, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Camera, 
  Monitor, 
  FileText, 
  Trash2, 
  Download, 
  AlertTriangle,
  Info,
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';
import exifr from 'exifr';

interface ExifData {
  fileName: string;
  fileSize: string;
  format: string;
  width?: number;
  height?: number;
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  lat?: number;
  lng?: number;
  raw?: any;
}

export const ExifAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertDMSToDecimal = (dms: any, ref: string) => {
    if (!dms || !ref) return null;
    const degrees = dms[0].numerator / dms[0].denominator;
    const minutes = dms[1].numerator / dms[1].denominator;
    const seconds = dms[2].numerator / dms[2].denominator;
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (ref === 'S' || ref === 'W') decimal = -decimal;
    return decimal;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG).');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setExifData(null);
    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);

      try {
        // Extract EXIF using exifr
        const allTags = await exifr.parse(selectedFile, true);
        const gpsData = await exifr.gps(selectedFile).catch(() => null);
        
        const img = new Image();
        img.onload = () => {
          setExifData({
            fileName: selectedFile.name,
            fileSize: formatFileSize(selectedFile.size),
            format: selectedFile.type.split('/')[1].toUpperCase(),
            width: img.width,
            height: img.height,
            make: allTags?.Make,
            model: allTags?.Model,
            software: allTags?.Software,
            dateTime: allTags?.DateTimeOriginal?.toString() || allTags?.DateTime?.toString(),
            lat: gpsData?.latitude || allTags?.latitude,
            lng: gpsData?.longitude || allTags?.longitude,
            raw: allTags
          });
          setIsAnalyzing(false);
        };
        img.src = url;
      } catch (err) {
        console.error("Error parsing EXIF:", err);
        // Still show the image even if EXIF parsing fails
        const img = new Image();
        img.onload = () => {
          setExifData({
            fileName: selectedFile.name,
            fileSize: formatFileSize(selectedFile.size),
            format: selectedFile.type.split('/')[1].toUpperCase(),
            width: img.width,
            height: img.height,
            raw: null
          });
          setIsAnalyzing(false);
        };
        img.src = url;
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeMetadata = () => {
    if (!previewUrl || !file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Download cleaned image
        const link = document.createElement('a');
        link.download = `cleaned_${file.name.split('.')[0]}.jpg`;
        link.href = cleanDataUrl;
        link.click();
      }
    };
    img.src = previewUrl;
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setExifData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-cyber-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 flex items-center justify-center">
            <ApertureIcon className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Metadata Analyzer</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Exif & GPS Forensic Tool</p>
          </div>
        </div>
        {file && (
          <button 
            onClick={reset}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-6">
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all cursor-pointer group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/jpeg,image/png"
            />
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white/20 group-hover:text-cyber-blue" />
            </div>
            <h4 className="text-sm font-bold mb-1">Drop image here</h4>
            <p className="text-xs text-white/40">Supports JPG, PNG (Max 10MB)</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Preview & Security Insights */}
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-cyber-blue animate-spin" />
                    <p className="text-xs font-bold text-cyber-blue animate-pulse">EXTRACTING METADATA...</p>
                  </div>
                )}
              </div>

              {/* Security Insights */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Security Insights
                </h4>
                <div className="grid gap-2">
                  {exifData ? (
                    <>
                      {exifData.lat !== undefined && (
                        <div className="bg-cyber-red/10 border border-cyber-red/30 p-3 rounded-xl flex items-start gap-3">
                          <ShieldAlert className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-cyber-red">GPS Data Found</p>
                            <p className="text-[10px] text-white/60 leading-relaxed">Exact coordinates are embedded. This reveals your physical location.</p>
                          </div>
                        </div>
                      )}
                      {exifData.dateTime && (
                        <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 p-3 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-cyber-yellow shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-cyber-yellow">Timestamp Detected</p>
                            <p className="text-[10px] text-white/60 leading-relaxed">The exact time of capture is visible. Can be used for pattern tracking.</p>
                          </div>
                        </div>
                      )}
                      {(exifData.make || exifData.model) && (
                        <div className="bg-cyber-blue/10 border border-cyber-blue/30 p-3 rounded-xl flex items-start gap-3">
                          <Info className="w-4 h-4 text-cyber-blue shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-cyber-blue">Device Info Exposed</p>
                            <p className="text-[10px] text-white/60 leading-relaxed">Camera/Phone model is visible. Contributes to digital fingerprinting.</p>
                          </div>
                        </div>
                      )}
                      {exifData.lat === undefined && !exifData.dateTime && !exifData.make && !exifData.model && (
                        <div className="bg-cyber-green/10 border border-cyber-green/30 p-3 rounded-xl flex items-start gap-3">
                          <ShieldCheck className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-cyber-green">Clean Metadata</p>
                            <p className="text-[10px] text-white/60 leading-relaxed">No sensitive EXIF tags were found in this image.</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={removeMetadata}
                  className="w-full bg-cyber-blue text-black py-4 rounded-xl text-sm font-bold hover:bg-cyber-blue/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                >
                  <Download className="w-5 h-5" /> Download Cleaned Image
                </button>
              </div>
            </div>

            {/* Right Column: Data Sections */}
            <div className="space-y-6">
              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Basic Information
                </h4>
                <div className="bg-black/20 rounded-xl border border-white/5 p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase mb-1">Filename</p>
                    <p className="text-xs font-mono truncate">{exifData?.fileName || '...'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase mb-1">Format</p>
                    <p className="text-xs font-mono">{exifData?.format || '...'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase mb-1">Resolution</p>
                    <p className="text-xs font-mono">{exifData?.width ? `${exifData.width} x ${exifData.height}` : '...'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase mb-1">File Size</p>
                    <p className="text-xs font-mono">{exifData?.fileSize || '...'}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Metadata */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <Camera className="w-3 h-3" />
                  Embedded Metadata
                </h4>
                <div className="bg-black/20 rounded-xl border border-white/5 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-2 shrink-0">
                      <Monitor className="w-4 h-4 text-white/20" />
                      <span className="text-xs text-white/60">Device</span>
                    </div>
                    <span className="text-xs font-bold sm:text-right break-words">{exifData?.model ? `${exifData.make} ${exifData.model}` : 'Not available'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-white/20" />
                      <span className="text-xs text-white/60">Timestamp</span>
                    </div>
                    <span className="text-xs font-bold sm:text-right break-words">{exifData?.dateTime || 'Time not available'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      <ApertureIcon className="w-4 h-4 text-white/20" />
                      <span className="text-xs text-white/60">Software</span>
                    </div>
                    <span className="text-xs font-bold sm:text-right break-all">{exifData?.software || 'Not available'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Location */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Geospatial Data
                </h4>
                <div className="bg-black/20 rounded-xl border border-white/5 p-4">
                  {exifData?.lat !== undefined && exifData?.lng !== undefined ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase mb-1">Latitude</p>
                          <p className="text-xs font-mono text-cyber-red">{Number(exifData.lat).toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase mb-1">Longitude</p>
                          <p className="text-xs font-mono text-cyber-red">{Number(exifData.lng).toFixed(6)}</p>
                        </div>
                      </div>
                      <a 
                        href={`https://www.google.com/maps?q=${exifData.lat},${exifData.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> View on Map
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <MapPin className="w-8 h-8 text-white/10 mb-2" />
                      <p className="text-xs text-white/40">Location not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
