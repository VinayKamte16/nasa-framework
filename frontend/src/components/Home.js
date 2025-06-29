import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Rocket, Globe, Satellite, Eye, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Home.css';
import DebugInfo from './DebugInfo';

const NEXT_MISSION = {
  name: 'Artemis II Moon Mission',
  date: '2025-11-15T18:00:00Z', // Example static date
  link: 'https://www.nasa.gov/specials/artemis-ii/'
};

function getTimeRemaining(targetDate) {
  const total = Date.parse(targetDate) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

const Home = () => {
  const features = [
    {
      title: 'Astronomy Picture of the Day',
      description: 'Discover stunning space imagery with NASA\'s daily featured photograph',
      icon: Camera,
      path: '/apod',
      color: '#667eea'
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore the Red Planet through the eyes of NASA\'s Mars rovers',
      icon: Rocket,
      path: '/mars-rover',
      color: '#ff6b6b'
    },
    {
      title: 'Earth Imagery',
      description: 'View our beautiful planet from space with high-resolution satellite imagery',
      icon: Globe,
      path: '/earth-imagery',
      color: '#51cf66'
    },
    {
      title: 'Near Earth Objects',
      description: 'Track asteroids and comets that approach Earth\'s orbit',
      icon: Satellite,
      path: '/neo',
      color: '#ffd93d'
    },
    {
      title: 'EPIC Earth Images',
      description: 'Daily natural color imagery of Earth from the EPIC camera',
      icon: Eye,
      path: '/epic',
      color: '#a855f7'
    }
  ];

  const [countdown, setCountdown] = useState(getTimeRemaining(NEXT_MISSION.date));
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeRemaining(NEXT_MISSION.date));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="home">
        {/* Temporary debug component - remove after fixing deployment issues */}
        <DebugInfo />
        
        <div className="hero">
          <h1>Explore the Universe with NASA explorer</h1>
          <p>Discover, visualize, and interact with real NASA data and imagery</p>
          <div className="mission-countdown-card">
            <h3>Next NASA Mission Launch</h3>
            <a href={NEXT_MISSION.link} target="_blank" rel="noopener noreferrer" className="mission-link">
              <strong>{NEXT_MISSION.name}</strong>
            </a>
            <div className="mission-date">{new Date(NEXT_MISSION.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })} UTC</div>
            {countdown.total > 0 ? (
              <div className="countdown-timer">
                <span>{countdown.days}d</span> :
                <span>{String(countdown.hours).padStart(2, '0')}h</span> :
                <span>{String(countdown.minutes).padStart(2, '0')}m</span> :
                <span>{String(countdown.seconds).padStart(2, '0')}s</span>
              </div>
            ) : (
              <div className="countdown-timer">Launched!</div>
            )}
          </div>
        </div>

        <div className="features">
          <h2>Explore NASA Data</h2>
          <Swiper
            className="home-swiper"
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
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <SwiperSlide key={index}>
                  <Link to={feature.path} className="feature-card">
                    <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                      <Icon size={32} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="info-section">
          <div className="card">
            <h3>Latest NASA News</h3>
            <ul className="nasa-news-list">
              <li>
                <a href="https://science.nasa.gov/blogs/solar-cycle-25/2025/06/17/sun-releases-strong-flare-8/" target="_blank" rel="noopener noreferrer">
                  <strong>Sun Releases Strong Flare</strong>
                </a>
                <p>The Sun emitted a strong X1.2-class flare on June 17, 2025, captured by NASA's Solar Dynamics Observatory. Solar flares can impact radio communications and pose risks to spacecraft and astronauts.</p>
              </li>
              <li>
                <a href="https://www.nasa.gov/image-article/a-star-like-no-other/" target="_blank" rel="noopener noreferrer">
                  <strong>A Star Like No Other</strong>
                </a>
                <p>Scientists have discovered a star behaving like no other seen before, giving fresh clues about the origin of a new class of mysterious objects. The discovery was made using NASA's Chandra X-ray Observatory and other telescopes.</p>
              </li>
              <li>
                <a href="https://www.nasa.gov/image-article/nasas-chandra-sees-surprisingly-strong-black-hole-jet-at-cosmic-noon/" target="_blank" rel="noopener noreferrer">
                  <strong>NASA's Chandra Sees Surprisingly Strong Black Hole Jet at Cosmic "Noon"</strong>
                </a>
                <p>A black hole has blasted out a powerful jet in the distant universe, detected by NASA's Chandra X-ray Observatory. This jet is illuminated by the leftover glow from the big bang itself.</p>
              </li>
              <li>
                <a href="https://www.nasa.gov/news/recently-published/" target="_blank" rel="noopener noreferrer">
                  <strong>More NASA News &rarr;</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home; 