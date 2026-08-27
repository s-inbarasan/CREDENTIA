import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export const FileIntegrityVerifier = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-black/30 p-4 rounded-xl border border-white/10" />
      {file && <p className="text-xs text-white/60">Verifying {file.name}...</p>}
    </div>
  );
};
