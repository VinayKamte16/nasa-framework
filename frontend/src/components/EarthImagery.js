import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Info } from 'lucide-react';
import dayjs from 'dayjs';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EONETPage = () => {
  const [eonetData, setEonetData] = useState([]);
  const [eonetLoading, setEonetLoading] = useState(true);
  const [eonetError, setEonetError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContinent, setModalContinent] = useState('');
  const [modalEvents, setModalEvents] = useState([]);

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
    <div className="eonet-page">
      <div className="page-header">
        <h1>Global Natural Events (EONET)</h1>
        <p>Explore real-time global natural events detected by NASA EONET</p>
      </div>
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

export default EONETPage; 