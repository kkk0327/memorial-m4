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
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const handleFlower = () => {
    if (hasFlowered) { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }
    else { setHasFlowered(true); setIsFlowering(true); setTimeout(() => setIsFlowering(false), 2600); }
  };

  const handleExit = () => {
    if (currentScene === 'select') setActiveMenu('main');
    else if (currentScene === 'bong1intro' || currentScene === 'yu' || currentScene === 'per') setCurrentScene('select');
    else setActiveMenu('main');
  };

  useEffect(() => {
    if (pannellumInstance.current) { pannellumInstance.current.destroy(); pannellumInstance.current = null; }
    if (activeMenu === 'gallery' && currentScene === 'per' && isPannellumLoaded && window.pannellum) {
      pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular", panorama: SCENE_CONFIG['per'].img, autoLoad: true, showControls: false, hfov: 120, maxHfov: 120
      });
    }
  }, [activeMenu, currentScene, isPannellumLoaded]);

  return (
    <div className="app-container">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" onLoad={() => setIsPannellumLoaded(true)} />

      {/* 방명록 모달 */}
      {showGuestbook && (
        <div className="guestbook-overlay">
          <div className="guestbook-modal">
            <h2>방명록</h2><textarea rows="5"></textarea>
            <button className="submit-btn" onClick={() => setShowGuestbook(false)}>등록하기</button>
            <button className="modal-close-btn" onClick={() => setShowGuestbook(false)}><X /></button>
          </div>
        </div>
      )}

      {/* 메인 화면 */}
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

      {/* 갤러리 */}
      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          {currentScene === 'bong1intro' ? (
            <div className="video-full-viewport">
              <video src="/videos/bong1intro.mp4" autoPlay playsInline onEnded={() => setCurrentScene('yu')} className="full-video-element" />
              <button className="exit-button" onClick={() => setCurrentScene('select')}><X size={32} color="white" /></button>
            </div>
          ) : (
            <div className="flat-scene-wrapper">
              {SCENE_CONFIG[currentScene]?.isPanorama ? <div ref={viewerRef} className="viewer-canvas" /> : <img src={SCENE_CONFIG[currentScene].img} className="flat-scene-img" />}
              {currentScene === 'select' && (
                <>
                  {/* 수정된 좌표 반영 */}
                  <button className="hotspot-btn" style={{left: '35%', top: '59%'}} onClick={() => setCurrentScene('bong1intro')}>봉안당 1</button>
                  <button className="hotspot-btn" style={{left: '53%', top: '62%'}}>봉안당 2</button>
                  <button className="hotspot-btn" style={{left: '65%', top: '48%'}}>봉안당 3</button>
                </>
              )}
              {currentScene === 'yu' && <div className="min-seong-clickbox" onClick={() => setCurrentScene('per')}></div>}
              <button className="exit-button" onClick={handleExit}><X size={32} color="white" /></button>
              {/* 타이틀 글씨체를 hotspot-btn과 통일 */}
              <div className="scene-title-badge">{SCENE_CONFIG[currentScene].title}</div>
            </div>
          )}
        </div>
      )}
      {showToast && <div className="toast-center">이미 헌화하셨습니다.</div>}

      <style jsx global>{`
        .hotspot-btn, .scene-title-badge { background: rgba(0,0,0,0.7); border: 2px solid #ef4444; color: white; padding: 10px 25px; border-radius: 8px; font-weight: bold; font-size: 1.2rem; cursor: pointer; }
        .scene-title-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); z-index: 130; }
        .hotspot-btn { position: absolute; transform: translate(-50%, -50%); z-index: 120; }
        /* 기타 스타일 유지 */
      `}</style>
    </div>
  );
}