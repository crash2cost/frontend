import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import { BarChart3, TrendingUp, DollarSign, AlertTriangle, Upload } from 'lucide-react';
import { ImageUpload } from '../components/common';
import type { ImageResponse } from '../api/image.api';
import { imageApi } from '../api/image.api';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<ImageResponse[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const images = await imageApi.getMyImages();
      setUploadedImages(images);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      for (const file of files) {
        await imageApi.uploadImage(file);
      }
      await loadImages();
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await imageApi.deleteImage(imageId);
      await loadImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const stats = [
    {
      title: 'Total Crashes',
      value: '0',
      icon: AlertTriangle,
      color: '#f97316',
      trend: '+0%'
    },
    {
      title: 'Total Cost',
      value: '₪0',
      icon: DollarSign,
      color: '#22c55e',
      trend: '+0%'
    },
    {
      title: 'This Month',
      value: '0',
      icon: BarChart3,
      color: '#38bdf8',
      trend: '+0%'
    },
    {
      title: 'Average Cost',
      value: '₪0',
      icon: TrendingUp,
      color: '#a78bfa',
      trend: '+0%'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your crash analytics overview</p>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{stat.title}</span>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTrend} style={{ color: stat.color }}>
              {stat.trend} from last month
            </div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Upload size={24} />
                Upload Crash Images
              </h2>
              <p className={styles.sectionSubtitle}>
                Upload photos of crashes to keep track of damage and details
              </p>
            </div>
          </div>

          <ImageUpload onUpload={handleUpload} maxFiles={10} maxSizeMB={10} />

          {uploading && (
            <div className={styles.uploadingMessage}>
              Uploading images...
            </div>
          )}
        </div>

        {uploadedImages.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Images ({uploadedImages.length})</h2>
            <div className={styles.imageGallery}>
              {uploadedImages.map((image) => (
                <div key={image.id} className={styles.galleryItem}>
                  <img 
                    src={imageApi.getImageUrl(image.id)} 
                    alt={image.filename}
                    className={styles.galleryImage}
                  />
                  <div className={styles.imageDetails}>
                    <span className={styles.imageName}>{image.filename}</span>
                    <button 
                      onClick={() => handleDeleteImage(image.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedImages.length === 0 && (
          <div className={styles.emptyState}>
            <AlertTriangle size={64} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No images uploaded yet</h3>
            <p className={styles.emptyText}>
              Upload crash images to start documenting incidents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
