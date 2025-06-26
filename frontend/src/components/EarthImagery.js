import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Search, Download, Wand2 } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EarthImagery = () => {
  const [earthData, setEarthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    lat: '40.7128',
    lon: '-74.0060',
    date: format(new Date(), 'yyyy-MM-dd'),
    dim: '0.15'
  });
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState(null);
  const [eonetData, setEonetData] = useState([]);
  const [eonetLoading, setEonetLoading] = useState(true);
  const [eonetError, setEonetError] = useState(null);

  const fetchEarthImagery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        lat: filters.lat,
        lon: filters.lon,
        date: filters.date,
        dim: filters.dim
      });

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/earth-imagery?${params}`);
      setEarthData(response.data);
    } catch (err) {
      setError('Failed to fetch Earth imagery. Please check your coordinates and try again.');
      console.error('Earth Imagery Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEarthImagery();
  };

  const handleDownload = () => {
    if (earthData?.url) {
      const link = document.createElement('a');
      link.href = earthData.url;
      link.download = `earth-${filters.lat}-${filters.lon}-${filters.date}.jpg`;
      link.click();
    }
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    setEnhanceError(null);
    setEnhancedImageUrl(null);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/enhance-image`, { imageUrl: earthData.url });
      setEnhancedImageUrl(response.data.enhancedUrl);
    } catch (err) {
      setEnhanceError('Failed to enhance image.');
    } finally {
      setEnhancing(false);
    }
  };

  useEffect(() => {
    const fetchEonet = async () => {
      setEonetLoading(true);
      setEonetError(null);
      try {
        const res = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events?status=open');
        setEonetData(res.data.events || []);
      } catch (err) {
        setEonetError('Failed to fetch EONET data.');
      }
      setEonetLoading(false);
    };
    fetchEonet();
  }, []);

  // Helper: Map lat/lon to continent
  function getContinent(lat, lon) {
    if (lat === undefined || lon === undefined) return 'Other';
    if (lat >= -35 && lat <= 37 && lon >= -17 && lon <= 51) return 'Africa';
    if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 60) return 'Europe';
    if (lat >= 7 && lat <= 83 && lon >= -168 && lon <= -52) return 'North America';
    if (lat >= -56 && lat <= 13 && lon >= -81 && lon <= -34) return 'South America';
    if (lat >= -50 && lat <= -10 && lon >= 110 && lon <= 180) return 'Australia';
    if (lat <= -60) return 'Antarctica';
    if (lat >= 1 && lat <= 77 && lon >= 26 && lon <= 180) return 'Asia';
    return 'Other';
  }

  // Group events by continent
  const continentCounts = {};
  eonetData.forEach(event => {
    // Use first geometry point
    const geom = event.geometry && event.geometry[0];
    if (geom && geom.coordinates && geom.coordinates.length === 2) {
      const [lon, lat] = geom.coordinates;
      const continent = getContinent(lat, lon);
      continentCounts[continent] = (continentCounts[continent] || 0) + 1;
    } else {
      continentCounts['Other'] = (continentCounts['Other'] || 0) + 1;
    }
  });
  const continentLabels = Object.keys(continentCounts);
  const continentValues = Object.values(continentCounts);

  const eonetChartData = {
    labels: continentLabels,
    datasets: [
      {
        label: 'Active Natural Events',
        data: continentValues,
        fill: false,
        borderColor: '#51cf66',
        backgroundColor: 'rgba(81, 207, 102, 0.2)',
        tension: 0.3,
      },
    ],
  };
  const eonetChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Active Natural Events per Continent (EONET)' },
    },
    scales: {
      x: {
        title: { display: true, text: 'Continent', font: { size: 16, weight: 'bold' } },
      },
      y: {
        title: { display: true, text: 'Event Count', font: { size: 16, weight: 'bold' } },
        beginAtZero: true,
      },
    },
  };

  // After fetching eonetData
  const eventDates = eonetData
    .map(event => event.geometry && event.geometry[0] && event.geometry[0].date)
    .filter(Boolean)
    .map(date => new Date(date));
  let dateRangeText = '';
  if (eventDates.length > 0) {
    const minDate = new Date(Math.min(...eventDates));
    const maxDate = new Date(Math.max(...eventDates));
    const format = d => dayjs(d).format('MMM D, YYYY');
    dateRangeText = `Showing events from ${format(minDate)} to ${format(maxDate)}`;
  }

  return (
    <div className="earth-imagery">
      <div className="page-header">
        <h1>Earth Imagery</h1>
        <p>View our beautiful planet from space with high-resolution satellite imagery</p>
      </div>

      <div className="filters-section">
        <div className="card">
          <h3>Location & Date</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label htmlFor="latitude">
                  <MapPin size={16} />
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="any"
                  placeholder="e.g., 40.7128"
                  value={filters.lat}
                  onChange={(e) => handleFilterChange('lat', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">
                  <MapPin size={16} />
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="any"
                  placeholder="e.g., -74.0060"
                  value={filters.lon}
                  onChange={(e) => handleFilterChange('lon', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="earth-date">
                  <Calendar size={16} />
                  Date
                </label>
                <input
                  type="date"
                  id="earth-date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimension">Dimension (degrees)</label>
                <input
                  type="number"
                  id="dimension"
                  step="0.01"
                  placeholder="e.g., 0.15"
                  value={filters.dim}
                  onChange={(e) => handleFilterChange('dim', e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              <Search size={16} />
              {loading ? 'Searching...' : 'Get Earth Image'}
            </button>
          </form>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Fetching Earth imagery...</div>}

      {earthData && !loading && !error && (
        <div className="earth-content">
          <Swiper
            className="earth-swiper"
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
            <SwiperSlide>
              <div className="card">
                <div className="image-container">
                  <img src={earthData.url} alt="Earth satellite imagery" />
                  <div style={{textAlign: 'center', marginTop: '8px', fontSize: '0.95em', color: '#aaa'}}>
                    <span>Tip: On mobile, long-press the image to save it.</span>
                  </div>
                </div>
                
                <div className="earth-info">
                  <h3>Earth Satellite Image</h3>
                  <div className="stats">
                    <div className="stat-card">
                      <h4>Latitude</h4>
                      <p>{earthData.lat}°</p>
                    </div>
                    <div className="stat-card">
                      <h4>Longitude</h4>
                      <p>{earthData.lon}°</p>
                    </div>
                    <div className="stat-card">
                      <h4>Date</h4>
                      <p>{format(new Date(earthData.date), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="stat-card">
                      <h4>Cloud Score</h4>
                      <p>{earthData.cloud_score || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <button onClick={handleDownload} className="btn">
                    <Download size={16} />
                    Download Image
                  </button>
                  <button onClick={handleEnhance} className="btn" disabled={enhancing} style={{ marginLeft: 12 }}>
                    <Wand2 size={16} />
                    {enhancing ? 'Enhancing...' : 'Enhance (HD)'}
                  </button>
                  {enhanceError && <div className="error" style={{ marginTop: 8 }}>{enhanceError}</div>}
                  {enhancedImageUrl && (
                    <div style={{ marginTop: 24 }}>
                      <h4>Enhanced Image (HD)</h4>
                      <div className="image-container">
                        <img src={enhancedImageUrl} alt="Enhanced Earth imagery" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}

      {/* EONET Natural Events Graph */}
      <div className="card" style={{ margin: '32px auto', maxWidth: 900 }}>
        <h3>Global Natural Events (EONET)</h3>
        {dateRangeText && (
          <div style={{ fontSize: '1rem', color: '#aaa', marginBottom: 8, marginTop: 16, textAlign: 'center' }}>{dateRangeText}</div>
        )}
        {eonetLoading ? (
          <div className="loading">Loading EONET data...</div>
        ) : eonetError ? (
          <div className="error">{eonetError}</div>
        ) : (
          <Line data={eonetChartData} options={eonetChartOptions} />
        )}
      </div>
    </div>
  );
};

export default EarthImagery; 