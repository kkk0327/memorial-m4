"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X } from 'lucide-react';

const SCENE_CONFIG = {
  'select': { img: '/images/select.jpg', title: '건물 선택' },
  'yu': { img: '/images/yu.jpg', title: '유골함' },
  'per': { img: '/images/per.jpg', title: '개인추모실', isPanorama: true }
};

export default function MemorialApp() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [currentScene, setCurrentScene] = useState('select');
  const [isFlowering, setIsFlowering] = useState(false);
  const [toast, setToast] = useState(false);
  const viewerRef = useRef(null);

  const startGallery = () => { setCurrentScene('select'); setActiveMenu('gallery'); };
  const handleBong1Exit = () => { setCurrentScene('yu'); setActiveMenu('gallery'); };
  
  const handleExit = () => {
    if (activeMenu === 'main') return;
    if (currentScene === 'select') setActiveMenu('main');
    else if (currentScene === 'bong1intro') setCurrentScene('select');
    else if (currentScene === 'yu' || currentScene === 'per') setCurrentScene('select');
    else setActiveMenu('main');
  };

  useEffect(() => {
    if (currentScene === 'per' && window.pannellum) {
      window.pannellum.viewer(viewerRef.current, { type: "equirectangular", panorama: SCENE_CONFIG['per'].img, autoLoad: true, showControls: false });
    }
  }, [currentScene]);

  return (
    <div className="app-container">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" />

      {activeMenu === 'main' && (
        <div className="main-viewport">
          <img src="/images/main.jpg" className="full-bg-mobile" />
          <img src="/images/maindesk.jpg" className="full-bg-desktop" />
          <div className="main-overlay">
            <h1 className="main-title">추모관</h1>
            <p className="main-subtitle">영원한 안식, 함께 기억합니다.</p>
            <div className="bottom-menu">
              <button onClick={() => { setIsFlowering(true); setTimeout(()=>setIsFlowering(false), 2600); }}><Flower2 color="white" /><span>헌화</span></button>
              <button onClick={() => setActiveMenu('video')}><Landmark color="white" /><span>추모관</span></button>
              <button><NotebookPen color="white" /><span>방명록</span></button>
            </div>
          </div>
          {isFlowering && <div className="flower-anim"><img src="/images/guk.png" /></div>}
        </div>
      )}

      {activeMenu === 'video' && (
        <div className="video-full-viewport">
          <video src="/videos/mo03.mp4" autoPlay playsInline onEnded={startGallery} className="full-video-element" />
          <button className="video-exit-button" onClick={startGallery}><X size={32} color="white" /></button>
        </div>
      )}

      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          {currentScene === 'bong1intro' ? (
            <div className="video-full-viewport" style={{ zIndex: 120 }}>
              <video src="/videos/bong1intro.mp4" autoPlay playsInline onEnded={handleBong1Exit} className="full-video-element" />
              <button className="video-exit-button" onClick={handleBong1Exit}><X size={32} color="white" /></button>
            </div>
          ) : (
            <div className="flat-scene-wrapper">
              {SCENE_CONFIG[currentScene]?.isPanorama ? <div ref={viewerRef} className="viewer-canvas" /> : <img src={SCENE_CONFIG[currentScene].img} className="flat-scene-img" />}
              {currentScene === 'select' && (
                <>
                  <div className="hotspot-btn" style={{ left: '25%', top: '50%' }} onClick={() => setCurrentScene('bong1intro')}>봉안당 1</div>
                  <div className="hotspot-btn" style={{ left: '50%', top: '75%' }} onClick={() => setCurrentScene('bong02')}>봉안당 2</div>
                  <div className="hotspot-btn" style={{ left: '75%', top: '50%' }} onClick={() => setCurrentScene('bong03')}>봉안당 3</div>
                </>
              )}
              {currentScene === 'yu' && <div className="min-seong-clickbox" onClick={() => setCurrentScene('per')}></div>}
              <button className="exit-button" onClick={handleExit}><X size={32} /></button>
              <div className="scene-title-badge">{SCENE_CONFIG[currentScene].title}</div>
            </div>
          )}
        </div>
      )}
      <style jsx global>{`
        .full-bg-mobile, .full-bg-desktop { width: 100%; height: 100%; object-fit: cover; }
        .full-bg-desktop { display: none; }
        @media (min-width: 769px) { .full-bg-mobile { display: none; } .full-bg-desktop { display: block; } }
        .hotspot-btn { position: absolute; transform: translate(-50%, -50%); background: rgba(0,0,0,0.6); color: white; padding: 10px 20px; border: 1px solid white; cursor: pointer; }
        .exit-button, .video-exit-button { cursor: pointer; border: 1px solid white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; }
        .exit-button { position: absolute; top: 30px; right: 30px; }
        .video-exit-button { position: absolute; top: 30px; right: 30px; z-index: 210; }
        .scene-title-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; background: rgba(0,0,0,0.7); padding: 10px 20px; }
        .viewer-canvas { width: 100%; height: 100%; }
        .min-seong-clickbox { position: absolute; top: 15%; left: 40%; width: 20%; height: 30%; cursor: pointer; }
        .flower-anim { position: absolute; left: 50%; bottom: 25%; z-index: 20; animation: up 2.6s forwards; }
        @keyframes up { 0% { bottom: 25%; opacity: 0; } 100% { bottom: 60%; opacity: 0; } }
      `}</style>
    </div>
  );
}