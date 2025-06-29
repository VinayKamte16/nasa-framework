import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: process.env.REACT_APP_API_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    backendHealth: null,
    error: null
  });

  const checkBackendHealth = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/health`);
      setDebugInfo(prev => ({
        ...prev,
        backendHealth: response.data
      }));
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🔧 Debug Information</h3>
      <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
        <p><strong>REACT_APP_API_URL:</strong> {debugInfo.apiUrl}</p>
        <p><strong>NODE_ENV:</strong> {debugInfo.nodeEnv}</p>
        <p><strong>Backend Health:</strong> {debugInfo.backendHealth ? '✅ Connected' : '❌ Not Connected'}</p>
        {debugInfo.backendHealth && (
          <p><strong>Backend Response:</strong> {JSON.stringify(debugInfo.backendHealth)}</p>
        )}
        {debugInfo.error && (
          <p><strong>Error:</strong> <span style={{ color: 'red' }}>{debugInfo.error}</span></p>
        )}
      </div>
      <button 
        onClick={checkBackendHealth}
        style={{ 
          marginTop: '10px', 
          padding: '8px 16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Connection
      </button>
    </div>
  );
};

export default DebugInfo; 