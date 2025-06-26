import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Search, AlertTriangle, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const NEO = () => {
  const [neoData, setNeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchNEO = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        start_date: filters.start_date,
        end_date: filters.end_date
      });

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/neo?${params}`);
      setNeoData(response.data);
    } catch (err) {
      setError('Failed to fetch NEO data. Please try again.');
      console.error('NEO Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNEO();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNEO();
  };

  const getHazardousClass = (isHazardous) => {
    return isHazardous ? 'hazardous' : 'safe';
  };

  const formatDistance = (distance) => {
    return `${parseFloat(distance).toFixed(2)} AU`;
  };

  const formatVelocity = (velocity) => {
    return `${parseFloat(velocity).toFixed(2)} km/s`;
  };

  const formatDiameter = (min, max) => {
    const avg = (parseFloat(min) + parseFloat(max)) / 2;
    return `${avg.toFixed(2)} km`;
  };

  if (loading) {
    return <div className="loading">Loading Near Earth Objects data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const allNeos = neoData ? Object.values(neoData.near_earth_objects || {}).flat() : [];
  const hazardousCount = allNeos.filter(neo => neo.is_potentially_hazardous_asteroid).length;
  const totalCount = allNeos.length;

  return (
    <div className="neo">
      <div className="page-header">
        <h1>Near Earth Objects (NEO)</h1>
        <p>Track asteroids and comets that approach Earth's orbit</p>
      </div>

      <div className="filters-section">
        <div className="card">
          <h3>Date Range</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label htmlFor="start-date">
                  <Calendar size={16} />
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  max={filters.end_date}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end-date">
                  <Calendar size={16} />
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  min={filters.start_date}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              <Search size={16} />
              {loading ? 'Searching...' : 'Search NEOs'}
            </button>
          </form>
        </div>
      </div>

      {neoData && (
        <div className="neo-content">
          <div className="stats">
            <div className="stat-card">
              <h3>{totalCount}</h3>
              <p>Total NEOs</p>
            </div>
            <div className="stat-card">
              <h3>{hazardousCount}</h3>
              <p>Potentially Hazardous</p>
            </div>
            <div className="stat-card">
              <h3>{neoData.element_count || 0}</h3>
              <p>Element Count</p>
            </div>
          </div>

          <div className="neo-list">
            <h3>Near Earth Objects</h3>
            
            {allNeos.length === 0 ? (
              <div className="no-results">
                <AlertTriangle size={48} />
                <p>No NEOs found for the selected date range.</p>
              </div>
            ) : (
              <Swiper
                className="neo-swiper"
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
                {allNeos.map((neo, index) => (
                  <SwiperSlide key={index}>
                    <div className={`neo-card card ${getHazardousClass(neo.is_potentially_hazardous_asteroid)}`}>
                      <div className="neo-header">
                        <h4>{neo.name}</h4>
                        {neo.is_potentially_hazardous_asteroid && (
                          <span className="hazardous-badge">
                            <AlertTriangle size={16} />
                            Hazardous
                          </span>
                        )}
                      </div>
                      
                      <div className="neo-details">
                        <p><strong>ID:</strong> {neo.id}</p>
                        <p><strong>Close Approach Date:</strong> {format(new Date(neo.close_approach_data[0]?.close_approach_date), 'MMM d, yyyy')}</p>
                        <p><strong>Miss Distance:</strong> {formatDistance(neo.close_approach_data[0]?.miss_distance.astronomical)}</p>
                        <p><strong>Relative Velocity:</strong> {formatVelocity(neo.close_approach_data[0]?.relative_velocity.kilometers_per_second)}</p>
                        <p><strong>Estimated Diameter:</strong> {formatDiameter(
                          neo.estimated_diameter.kilometers.estimated_diameter_min,
                          neo.estimated_diameter.kilometers.estimated_diameter_max
                        )}</p>
                        <p><strong>Orbiting Body:</strong> {neo.close_approach_data[0]?.orbiting_body}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NEO; 