import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_MAX_FILES, DEFAULT_MAX_SIZE_MB } from './imageUpload.constants';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB 
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload only image files');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }
    return true;
  }, [maxSizeMB]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (images.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setError(null);
    const newImages = [...images, ...validFiles];
    setImages(newImages);

    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (onUpload) {
      onUpload(newImages);
    }
  }, [images, maxFiles, onUpload, validateFile]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('file-upload')?.click();
          }
        }}
      >
        <input
          type="file"
          id="file-upload"
          className={styles.fileInput}
          onChange={handleFileInput}
          accept="image/*"
          multiple
          max={maxFiles}
        />
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <Upload size={48} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            Drag and drop images here or <span className={styles.browseText}>browse</span>
          </p>
          <p className={styles.uploadHint}>
            Maximum {maxFiles} images, up to {maxSizeMB}MB each
          </p>
        </label>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className={styles.previewGrid}>
          {previews.map((preview, index) => (
            <div key={`preview-${index}-${images[index]?.name}`} className={styles.previewItem}>
              <img src={preview} alt={`Preview ${index + 1}`} className={styles.previewImage} />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeImage(index)}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
              <div className={styles.imageInfo}>
                <ImageIcon size={14} />
                <span>{images[index]?.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
