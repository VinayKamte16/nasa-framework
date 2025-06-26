import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Search, Download, Wand2, Info } from 'lucide-react';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContinent, setModalContinent] = useState('');
  const [modalEvents, setModalEvents] = useState([]);
  const [formError, setFormError] = useState(null);

  const quickSelects = [
    { label: 'New York (2023-06-15)', lat: '40.7128', lon: '-74.0060', date: '2023-06-15' },
    { label: 'London (2022-08-10)', lat: '51.5074', lon: '-0.1278', date: '2022-08-10' },
    { label: 'Sydney (2021-12-01)', lat: '-33.8688', lon: '151.2093', date: '2021-12-01' },
    { label: 'Cairo (2020-04-20)', lat: '30.0444', lon: '31.2357', date: '2020-04-20' },
    { label: 'Tokyo (2019-09-05)', lat: '35.6895', lon: '139.6917', date: '2019-09-05' },
    { label: 'Rio (2018-03-15)', lat: '-22.9068', lon: '-43.1729', date: '2018-03-15' },
  ];

  const isValidDateFormat = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  const parseToISODate = (input) => {
    // If already in YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    // Try DD/MM/YYYY
    const ddmmyyyy = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
    // Try MM/DD/YYYY
    const mmddyyyy = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (mmddyyyy) return `${mmddyyyy[3]}-${mmddyyyy[1]}-${mmddyyyy[2]}`;
    return null;
  };

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
    if (field === 'date') {
      let iso = value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        iso = parseToISODate(value);
        if (iso) {
          setFilters(prev => ({ ...prev, [field]: iso }));
          setFormError(null);
          return;
        } else {
          setFormError('Please enter the date in YYYY-MM-DD format.');
          return;
        }
      }
    }
    setFilters(prev => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!isValidDateFormat(filters.date)) {
      setFormError('Please enter the date in YYYY-MM-DD format.');
      return;
    }
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

  // Map continent to event names
  const continentEvents = {};
  eonetData.forEach(event => {
    const geom = event.geometry && event.geometry[0];
    if (geom && geom.coordinates && geom.coordinates.length === 2) {
      const [lon, lat] = geom.coordinates;
      const continent = getContinent(lat, lon);
      if (!continentEvents[continent]) continentEvents[continent] = [];
      continentEvents[continent].push(event.title);
    } else {
      if (!continentEvents['Other']) continentEvents['Other'] = [];
      continentEvents['Other'].push(event.title);
    }
  });

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
        ticks: {
          color: '#fff',
          font: { size: 14 },
        },
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

      {/* Quick Select Section */}
      <div className="quick-selects" style={{ margin: '16px 0', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {quickSelects.map((q, i) => (
          <button key={i} className="btn" style={{ padding: '6px 14px', fontSize: 14 }}
            onClick={() => setFilters({ lat: q.lat, lon: q.lon, date: q.date, dim: '0.15' })}>
            {q.label}
          </button>
        ))}
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
          {formError && <div className="error" style={{ marginTop: 8 }}>{formError}</div>}
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
          <>
            <Line data={eonetChartData} options={eonetChartOptions} />
            {/* Info icons row below chart */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, margin: '18px 0 0 0', flexWrap: 'wrap' }}>
              {continentLabels.map(label => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: '#51cf66', fontWeight: 600, fontSize: 15 }}
                  title={`Show events for ${label}`}
                  onClick={() => {
                    setModalContinent(label);
                    setModalEvents(continentEvents[label] || []);
                    setModalOpen(true);
                  }}
                >
                  <Info size={16} style={{ marginRight: 4 }} />{label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal for event names */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
          <div style={{ background: '#181c2a', padding: 24, borderRadius: 12, minWidth: 320, maxWidth: 480, maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#51cf66', marginBottom: 12 }}>Events in {modalContinent}</h3>
            {modalEvents.length > 0 ? (
              <ul style={{ color: '#fff', paddingLeft: 18 }}>
                {modalEvents.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            ) : (
              <div style={{ color: '#aaa' }}>No events found.</div>
            )}
            <button style={{ marginTop: 18, background: '#51cf66', color: '#181c2a', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthImagery; 