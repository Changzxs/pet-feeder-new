import React, { useState, useEffect, useCallback } from 'react';
import './CameraPage.scss';

const CameraPage = () => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [view, setView] = useState('live');
  const [esp32Ip] = useState('192.168.0.145');
  const [loadingError, setLoadingError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized function to fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch(`http://${esp32Ip}/photos.json?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to load gallery');
      return await response.json();
    } catch (error) {
      console.error('Error fetching photos:', error);
      setLoadingError('Failed to load photos. Please try again.');
      return [];
    }
  }, [esp32Ip]);

  // Load gallery photos
  const loadGallery = useCallback(async () => {
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      const photoList = await fetchPhotos();
      
      // Create new photo objects with cache-busting URLs
      const newPhotos = photoList.map((path, index) => ({
        id: `${path}_${index}`,
        url: `http://${esp32Ip}${path}?t=${Date.now()}`,
        timestamp: new Date().toLocaleString(), // Or extract from filename if possible
        path: path
      }));

      setPhotos(newPhotos);
    } catch (error) {
      console.error('Error loading gallery:', error);
      setLoadingError('Failed to load gallery. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  }, [esp32Ip, fetchPhotos]);

  // Take a new photo
  const takePhoto = useCallback(async () => {
    setIsTakingPhoto(true);
    setLoadingError(null);
    
    try {
      const response = await fetch(`http://${esp32Ip}/capture`);
      if (!response.ok) throw new Error('Failed to capture photo');
      
      const data = await response.json();
      if (data.success) {
        // Add the new photo immediately with cache-busting
        const newPhoto = {
          id: `new_${Date.now()}`,
          url: `http://${esp32Ip}${data.path}?t=${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          path: data.path
        };
        
        setPhotos(prev => [newPhoto, ...prev]);
        
        // Refresh the full gallery after a short delay
        setTimeout(() => {
          loadGallery();
        }, 1000);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setLoadingError('Failed to capture photo. Please try again.');
    } finally {
      setIsTakingPhoto(false);
    }
  }, [esp32Ip, loadGallery]);

  // Load gallery when view changes
  useEffect(() => {
    if (view === 'gallery') {
      loadGallery();
    }
  }, [view, loadGallery]);

  // Auto-refresh gallery every 30 seconds when in gallery view
  useEffect(() => {
    if (view !== 'gallery') return;
    
    const interval = setInterval(() => {
      loadGallery();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [view, loadGallery]);

  return (
    <div className="camera-page">
      <h1>Pet Camera</h1>
      <p className="subtitle">Watch your pet in real-time</p>

      <div className="view-tabs">
        <button 
          className={`view-tab ${view === 'live' ? 'active' : ''}`}
          onClick={() => setView('live')}
          disabled={isTakingPhoto}
        >
          Live View
        </button>
        <button 
          className={`view-tab ${view === 'gallery' ? 'active' : ''}`}
          onClick={() => setView('gallery')}
          disabled={isTakingPhoto}
        >
          Gallery ({photos.length})
        </button>
      </div>

      <div className="section-divider"></div>

      {loadingError && (
        <div className="error-message">
          {loadingError}
          <button onClick={() => view === 'gallery' ? loadGallery() : takePhoto()}>
            Retry
          </button>
        </div>
      )}

      {view === 'live' ? (
        <section className="live-feed-section">
          <div className="camera-feed">
            <img 
              src={`http://${esp32Ip}/stream`} 
              alt="Live camera feed" 
              className="live-feed"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/camera-offline.jpg';
                setLoadingError('Live feed unavailable');
              }}
            />
          </div>
          
          <div className="camera-controls">
            <button 
              onClick={takePhoto} 
              disabled={isTakingPhoto}
              className={`capture-button ${isTakingPhoto ? 'capturing' : ''}`}
            >
              {isTakingPhoto ? (
                <>
                  <span className="spinner"></span>
                  Capturing...
                </>
              ) : 'Take Photo'}
            </button>
          </div>
        </section>
      ) : (
        <section className="gallery-section">
          {isLoading ? (
            <div className="loading-spinner">
              <span className="spinner"></span>
              Loading photos...
            </div>
          ) : photos.length === 0 ? (
            <div className="no-photos">
              <p>No photos yet. Take some pictures!</p>
              <button onClick={takePhoto} disabled={isTakingPhoto}>
                Take First Photo
              </button>
            </div>
          ) : (
            <>
              <div className="gallery-controls">
                <button onClick={loadGallery} disabled={isLoading}>
                  Refresh Gallery
                </button>
              </div>
              
              <div className="photo-grid">
                {photos.map(photo => (
                  <div key={photo.id} className="photo-item">
                    <div className="photo-wrapper">
                      <img 
                        src={photo.url} 
                        alt={`Pet photo ${photo.id}`} 
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/image-error.jpg';
                        }}
                      />
                      <p className="photo-timestamp">{photo.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default CameraPage;