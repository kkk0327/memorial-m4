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
  const [hasFlowered, setHasFlowered] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState([]);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const handleFlower = () => {
    if (hasFlowered) {
      setToastMessage(["이미 헌화하셨습니다.", "따뜻한 마음 감사합니다."]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      setHasFlowered(true);
      setIsFlowering(true);
      setTimeout(() => setIsFlowering(false), 2600);
    }
  };

  const handleMo03Exit = () => {
    setActiveMenu('gallery');
    setCurrentScene('select');
  };

  const handleExit = () => {
    if (currentScene === 'select') setActiveMenu('main');
    else if (currentScene === 'bong1intro') setCurrentScene('yu'); // 수정: 영상 X 시 유골함으로
    else if (currentScene === 'yu') setCurrentScene('select');
    else if (currentScene === 'per') setCurrentScene('yu');
    else setCurrentScene('select');
  };

  useEffect(() => {
    if (pannellumInstance.current) { pannellumInstance.current.destroy(); pannellumInstance.current = null; }
    if (activeMenu === 'gallery' && currentScene === 'per' && isPannellumLoaded && window.pannellum) {
      if (viewerRef.current) {
        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          type: "equirectangular", panorama: SCENE_CONFIG['per'].img, autoLoad: true, showControls: false, hfov: 120, maxHfov: 120
        });
      }
    }
  }, [activeMenu, currentScene, isPannellumLoaded]);

  return (
    <div className="app-container">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" onLoad={() => setIsPannellumLoaded(true)} />

      {showGuestbook && (
        <div className="guestbook-overlay">
          <div className="guestbook-modal">
            <h2>방명록</h2>
            <textarea rows="5"></textarea>
            <button className="submit-btn" onClick={() => setShowGuestbook(false)}>등록하기</button>
            <button className="modal-close-btn" onClick={() => setShowGuestbook(false)}><X /></button>
          </div>
        </div>
      )}

      {activeMenu === 'main' && (
        <div className="main-viewport">
          <img src="/images/main.jpg" className="full-bg-mobile" />
          <img src="/images/maindesk.jpg" className="full-bg-desktop" />
          <div className="main-overlay">
            <div className="text-container">
              <h1 className="main-title">추모관</h1>
              <p className="main-subtitle">영원한 안식, 함께 기억합니다.</p>
            </div>
            <div className="bottom-menu">
              <button onClick={handleFlower}><Flower2 size={38} color="white" /><span>헌화</span></button>
              <button onClick={() => { setActiveMenu('gallery'); setCurrentScene('select'); }}><Landmark size={38} color="white" /><span>추모관</span></button>
              <button onClick={() => setShowGuestbook(true)}><NotebookPen size={38} color="white" /><span>방명록</span></button>
            </div>
          </div>
          {isFlowering && <div className="flower-anim"><img src="/images/guk.png" /></div>}
        </div>
      )}

      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          {currentScene === 'bong1intro' ? (
            <div className="video-full-viewport">
              <video src="/videos/bong1intro.mp4" autoPlay playsInline onEnded={() => setCurrentScene('yu')} className="full-video-element" />
              <button className="exit-button" onClick={handleExit}><X size={32} color="white" /></button>
            </div>
          ) : (
            <div className="flat-scene-wrapper">
              {SCENE_CONFIG[currentScene]?.isPanorama ? <div ref={viewerRef} className="viewer-canvas" /> : <img src={SCENE_CONFIG[currentScene].img} className="flat-scene-img" />}
              {currentScene === 'select' && (
                <>
                  <button className="hotspot-btn" style={{left: '40%', top: '37%'}} onClick={() => setCurrentScene('bong1intro')}>봉안당 1</button>
                  <button className="hotspot-btn" style={{left: '53%', top: '62%'}}>봉안당 2</button>
                  <button className="hotspot-btn" style={{left: '60%', top: '46%'}}>봉안당 3</button>
                </>
              )}
              {currentScene === 'yu' && <div className="min-seong-clickbox" onClick={() => setCurrentScene('per')}></div>}
              <button className="exit-button" onClick={handleExit}><X size={32} color="white" /></button>
              {SCENE_CONFIG[currentScene]?.title && <div className="hotspot-btn" style={{left: '50%', top: '30px', transform: 'translateX(-50%)'}}>{SCENE_CONFIG[currentScene].title}</div>}
            </div>
          )}
        </div>
      )}
      {showToast && <div className="toast-center">{toastMessage.map((line, i) => <div key={i}>{line}</div>)}</div>}

      <style jsx global>{`
        body, html { margin:0; padding:0; width:100%; height:100%; background:#000; overflow:hidden; font-family:'Noto Serif KR', serif; }
        .app-container { width:100vw; height:100vh; display:flex; justify-content:center; align-items:center; }
        .main-viewport { position:relative; width:100%; height:100%; overflow:hidden; }
        .full-bg-mobile { display: block; width: 100%; height: 100%; object-fit: cover; }
        .full-bg-desktop { display: none; width: 100%; height: 100%; object-fit: cover; }
        @media (min-width: 769px) { .full-bg-mobile { display: none; } .full-bg-desktop { display: block; } }
        .main-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:space-between; padding:10vh 5vw; pointer-events:none; }
        .main-overlay > * { pointer-events:auto; }
        .text-container { text-align:center; }
        .main-title { font-size:5rem; color:#000; font-weight:bold; margin:0; text-shadow:0 0 10px rgba(255,255,255,0.8); }
        .main-subtitle { font-size:1.5rem; color:#000; font-weight:bold; margin-top:10px; text-shadow:0 0 10px rgba(255,255,255,0.8); }
        .bottom-menu { display:flex; justify-content:flex-end; gap:50px; width:100%; padding-right:2vw; }
        .bottom-menu button { background:none; border:none; color:white; display:flex; flex-direction:column; align-items:center; gap:10px; cursor:pointer; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8)); }
        .bottom-menu button span { font-size:1.25rem; font-weight:bold; }
        .flower-anim { position:absolute; left:50%; bottom:25%; transform:translateX(-50%); z-index:20; animation:flower-up 2.6s forwards; pointer-events:none; }
        .flower-anim img { width:150px; }
        @keyframes flower-up { 0% { bottom:25%; opacity:0; } 20% { opacity:1; } 100% { bottom:60%; opacity:0; } }
        .video-full-viewport { position:fixed; inset:0; z-index:200; background:#000; }
        .full-video-element { width:100%; height:100%; object-fit:cover; }
        .gallery-full-viewport { position:fixed; inset:0; z-index:100; background:#000; }
        .flat-scene-wrapper { position:absolute; inset:0; width:100vw; height:100vh; }
        .flat-scene-img { width:100%; height:100%; object-fit:contain; }
        .viewer-canvas { position:absolute; inset:0; width:100%; height:100%; background:#000; }
        .hotspot-btn { position:absolute; transform:translate(-50%, -50%); background:rgba(0,0,0,0.7); border:2px solid #ef4444; color:white; padding:10px 25px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:1.2rem; z-index:120; }
        .exit-button { position:absolute; top:30px; right:30px; z-index:250; background:rgba(0,0,0,0.5); border:1px solid #fff; border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .min-seong-clickbox { position:absolute; top:15%; left:40%; width:20%; height:30%; cursor:pointer; z-index:115; }
        .toast-center { position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.85); color:white; padding:22px 45px; border-radius:20px; z-index:500; text-align:center; font-size:1.2rem; line-height:1.5; }
        .guestbook-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:600; display:flex; justify-content:center; align-items:center; }
        .guestbook-modal { background:white; padding:40px; border-radius:12px; width:500px; display:flex; flex-direction:column; gap:15px; position:relative; }
        .submit-btn { background:#3b82f6; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer; }
        .modal-close-btn { position:absolute; top:20px; right:20px; background:none; border:none; cursor:pointer; }
      `}</style>
    </div>
  );
}