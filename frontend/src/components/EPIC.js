import React, { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Calendar, Search, Download, Eye } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const EPIC = () => {
  const [epicData, setEpicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2021-06-01'); // Default to a known working date

  const fetchEPIC = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/epic?date=${date}`);
      setEpicData(response.data || []);
    } catch (err) {
      setError('Failed to fetch EPIC data. Please try again.');
      console.error('EPIC Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEPIC(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDownload = (image, date) => {
    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date.replace(/-/g, '/')}/png/${image.image}.png`;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `epic-${image.image}-${date}.png`;
    link.click();
  };

  const getImageUrl = (image, date) => {
    return `https://epic.gsfc.nasa.gov/archive/natural/${date.replace(/-/g, '/')}/png/${image.image}.png`;
  };

  if (loading) {
    return <div className="loading">Loading EPIC Earth images...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="epic">
      <div className="page-header">
        <h1>EPIC Earth Images</h1>
        <p>Daily natural color imagery of Earth from the EPIC camera aboard the DSCOVR satellite</p>
      </div>

      <div className="date-selector">
        <div className="form-group">
          <label htmlFor="epic-date">
            <Calendar size={20} />
            Select Date
          </label>
          <input
            type="date"
            id="epic-date"
            value={selectedDate}
            onChange={handleDateChange}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
      </div>

      {epicData.length === 0 ? (
        <div className="no-results">
          <Eye size={48} />
          <p>No EPIC images available for the selected date. Try a different date (e.g., 2021-06-01).</p>
        </div>
      ) : (
        <div className="epic-content">
          <h3>EPIC Images for {format(parseISO(selectedDate), 'MMMM d, yyyy')}</h3>
          <Swiper
            className="epic-swiper"
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
            {epicData.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="epic-card card">
                  <div className="image-container">
                    <img 
                      src={getImageUrl(image, selectedDate)} 
                      alt={`EPIC Earth image ${index + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="image-error" style={{ display: 'none' }}>
                      <Eye size={48} />
                      <p>Image not available</p>
                      <p style={{ color: '#aaa', fontSize: '0.95em' }}>Try an earlier date (e.g., 2021-06-01)</p>
                    </div>
                  </div>
                  <div className="epic-info">
                    <h4>EPIC Image {index + 1}</h4>
                    <div className="stats">
                      <div className="stat-card">
                        <h5>Latitude</h5>
                        <p>{parseFloat(image.centroid_coordinates.lat).toFixed(2)}°</p>
                      </div>
                      <div className="stat-card">
                        <h5>Longitude</h5>
                        <p>{parseFloat(image.centroid_coordinates.lon).toFixed(2)}°</p>
                      </div>
                      <div className="stat-card">
                        <h5>DSCOVR Distance</h5>
                        <p>{parseFloat(image.dscovr_j2000_position.x).toFixed(0)} km</p>
                      </div>
                      <div className="stat-card">
                        <h5>Lunar Distance</h5>
                        <p>{parseFloat(image.lunar_j2000_position.x).toFixed(0)} km</p>
                      </div>
                    </div>
                    <p className="timestamp">
                      <strong>Timestamp:</strong> {
                        image.date && isValid(parseISO(image.date))
                          ? format(parseISO(image.date), "MMM d, yyyy HH:mm 'UTC'")
                          : 'Unknown'
                      }
                    </p>
                    <button 
                      onClick={() => handleDownload(image, selectedDate)} 
                      className="btn"
                    >
                      <Download size={16} />
                      Download Image
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default EPIC; 