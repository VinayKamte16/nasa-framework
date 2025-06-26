import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Camera, Calendar, Search, Download } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MarsRover = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rover: 'curiosity',
    earth_date: format(new Date(), 'yyyy-MM-dd'),
    camera: '',
    sol: ''
  });

  const rovers = [
    { value: 'curiosity', label: 'Curiosity' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'spirit', label: 'Spirit' },
    { value: 'perseverance', label: 'Perseverance' }
  ];

  const cameras = {
    curiosity: [
      { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
      { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
      { value: 'mast', label: 'Mast Camera' },
      { value: 'chemcam', label: 'Chemistry and Camera Complex' },
      { value: 'mahli', label: 'Mars Hand Lens Imager' },
      { value: 'mardi', label: 'Mars Descent Imager' },
      { value: 'navcam', label: 'Navigation Camera' }
    ],
    opportunity: [
      { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
      { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
      { value: 'navcam', label: 'Navigation Camera' },
      { value: 'pancam', label: 'Panoramic Camera' },
      { value: 'minites', label: 'Miniature Thermal Emission Spectrometer' }
    ],
    spirit: [
      { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
      { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
      { value: 'navcam', label: 'Navigation Camera' },
      { value: 'pancam', label: 'Panoramic Camera' },
      { value: 'minites', label: 'Miniature Thermal Emission Spectrometer' }
    ],
    perseverance: [
      { value: 'edl_rucam', label: 'Rover Up-Look Camera' },
      { value: 'edl_ddcam', label: 'Descent Stage Down-Look Camera' },
      { value: 'edl_pucam1', label: 'Parachute Up-Look Camera A' },
      { value: 'edl_pucam2', label: 'Parachute Up-Look Camera B' },
      { value: 'navcam_left', label: 'Navigation Camera - Left' },
      { value: 'navcam_right', label: 'Navigation Camera - Right' },
      { value: 'mcz_left', label: 'Mast Camera Zoom - Left' },
      { value: 'mcz_right', label: 'Mast Camera Zoom - Right' },
      { value: 'front_hazcam_left_a', label: 'Front Hazard Avoidance Camera - Left A' },
      { value: 'front_hazcam_right_a', label: 'Front Hazard Avoidance Camera - Right A' },
      { value: 'rear_hazcam_left', label: 'Rear Hazard Avoidance Camera - Left' },
      { value: 'rear_hazcam_right', label: 'Rear Hazard Avoidance Camera - Right' },
      { value: 'edl_rdcam', label: 'Rover Down-Look Camera' },
      { value: 'skycam', label: 'MEDA Skycam' },
      { value: 'sherloc_watson', label: 'SHERLOC WATSON Camera' },
      { value: 'supercam_rmi', label: 'SuperCam Remote Micro Imager' },
      { value: 'lcam', label: 'Lander Vision System Camera' }
    ]
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        rover: filters.rover,
        ...(filters.earth_date && { earth_date: filters.earth_date }),
        ...(filters.camera && { camera: filters.camera }),
        ...(filters.sol && { sol: filters.sol })
      });

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mars-rover?${params}`);
      setPhotos(response.data.photos || []);
    } catch (err) {
      setError('Failed to fetch Mars Rover photos. Please try again.');
      console.error('Mars Rover Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPhotos();
  };

  const handleDownload = (imgSrc, roverName, date) => {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = `mars-${roverName}-${date}.jpg`;
    link.click();
  };

  return (
    <div className="mars-rover">
      <div className="page-header">
        <h1>Mars Rover Photos</h1>
        <p>Explore the Red Planet through the eyes of NASA's Mars rovers</p>
      </div>

      <div className="filters-section">
        <div className="card">
          <h3>Search Filters</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label htmlFor="rover">Rover</label>
                <select
                  id="rover"
                  value={filters.rover}
                  onChange={(e) => handleFilterChange('rover', e.target.value)}
                >
                  {rovers.map(rover => (
                    <option key={rover.value} value={rover.value}>
                      {rover.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="earth-date">
                  <Calendar size={16} />
                  Earth Date
                </label>
                <input
                  type="date"
                  id="earth-date"
                  value={filters.earth_date}
                  onChange={(e) => handleFilterChange('earth_date', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="camera">Camera</label>
                <select
                  id="camera"
                  value={filters.camera}
                  onChange={(e) => handleFilterChange('camera', e.target.value)}
                >
                  <option value="">All Cameras</option>
                  {cameras[filters.rover]?.map(camera => (
                    <option key={camera.value} value={camera.value}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sol">Sol (Martian Day)</label>
                <input
                  type="number"
                  id="sol"
                  placeholder="Enter sol number"
                  value={filters.sol}
                  onChange={(e) => handleFilterChange('sol', e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              <Search size={16} />
              {loading ? 'Searching...' : 'Search Photos'}
            </button>
          </form>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Searching Mars Rover photos...</div>}

      {!loading && !error && (
        <div className="results-section">
          <h3>Results ({photos.length} photos)</h3>
          
          {photos.length === 0 ? (
            <div className="no-results">
              <Camera size={48} />
              <p>No photos found for the selected criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <Swiper
                className="marsrover-swiper"
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                modules={[Navigation, Pagination, A11y]}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  900: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 }
                }}
                style={{ padding: '24px 0' }}
              >
                {photos.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <div className="photo-card card">
                      <div className="image-container">
                        <img src={photo.img_src} alt={`Mars photo ${index + 1}`} />
                      </div>
                      <div className="photo-info">
                        <h4>{photo.camera.full_name}</h4>
                        <p><strong>Rover:</strong> {photo.rover.name}</p>
                        <p><strong>Date:</strong> {format(new Date(photo.earth_date), 'MMM d, yyyy')}</p>
                        <p><strong>Sol:</strong> {photo.sol}</p>
                        <button
                          onClick={() => handleDownload(photo.img_src, photo.rover.name, photo.earth_date)}
                          className="btn"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MarsRover; 