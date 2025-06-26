import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import axios from 'axios';
import './APOD.css';

const APOD = () => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchAPOD = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/apod?date=${date}`);
      setApodData(response.data);
    } catch (err) {
      setError('Failed to fetch APOD data. Please try again.');
      console.error('APOD Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDownload = () => {
    if (apodData?.hdurl) {
      const link = document.createElement('a');
      link.href = apodData.hdurl;
      link.download = `apod-${selectedDate}.jpg`;
      link.click();
    }
  };

  if (loading) {
    return <div className="loading">Loading Astronomy Picture of the Day...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="apod">
      <div className="page-header">
        <h1>Astronomy Picture of the Day</h1>
        <p>Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured.</p>
      </div>

      <div className="date-selector">
        <div className="form-group">
          <label htmlFor="apod-date">
            <Calendar size={20} />
            Select Date
          </label>
          <input
            type="date"
            id="apod-date"
            value={selectedDate}
            onChange={handleDateChange}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
      </div>

      {apodData && (
        <div className="apod-content">
          <div className="card">
            <div className="image-container">
              {apodData.media_type === 'image' ? (
                <img src={apodData.url} alt={apodData.title} />
              ) : (
                <iframe
                  src={apodData.url}
                  title={apodData.title}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>

            <div className="apod-info">
              <h2>{apodData.title}</h2>
              <p className="date">{format(new Date(apodData.date), 'MMMM d, yyyy')}</p>
              <p className="explanation">{apodData.explanation}</p>
              
              {apodData.copyright && (
                <p className="copyright">© {apodData.copyright}</p>
              )}

              <div className="apod-actions">
                {apodData.media_type === 'image' && apodData.hdurl && (
                  <button onClick={handleDownload} className="btn">
                    <Download size={16} />
                    Download HD Image
                  </button>
                )}
                
                {apodData.url && (
                  <a href={apodData.url} target="_blank" rel="noopener noreferrer" className="btn">
                    <ExternalLink size={16} />
                    View Original
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APOD; 