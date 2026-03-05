"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X } from 'lucide-react';

// 예전의 SCENE_CONFIG 방식을 유지하여 레이아웃 깨짐 방지
const SCENE_CONFIG = {
  'select': { title: '건물 선택', img: '/images/select.jpg' },
  'yu': { title: '유골함', img: '/images/yu.jpg' },
  'per': { title: '개인추모실', img: '/images/per.jpg', isPanorama: true }
};

export default function MemorialApp() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [currentScene, setCurrentScene] = useState('select');
  const [isFlowering, setIsFlowering] = useState(false);
  const viewerRef = useRef(null);

  // 예전의 헌화, 엑스 버튼 등 UI 기능 완전 복구
  const startGallery = () => { setActiveMenu('gallery'); setCurrentScene('select'); };
  const handleBong1Exit = () => { setCurrentScene('yu'); };

  return (
    <div className="app-container">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" />

      {/* 메인 화면 레이아웃 복구 */}
      {activeMenu === 'main' && (
        <div className="main-viewport">
          <img src="/images/main.jpg" className="full-bg-mobile" />
          <img src="/images/maindesk.jpg" className="full-bg-desktop" />
          <div className="main-overlay">
            <div className="main-header">
                <h1 className="main-title">추모관</h1>
                <p className="main-subtitle">영원한 안식, 함께 기억합니다.</p>
            </div>
            <div className="bottom-menu">
              <button onClick={() => { setIsFlowering(true); setTimeout(()=>setIsFlowering(false), 2600); }}><Flower2 color="white" /><span>헌화</span></button>
              <button onClick={() => setActiveMenu('video')}><Landmark color="white" /><span>추모관</span></button>
              <button><NotebookPen color="white" /><span>방명록</span></button>
            </div>
          </div>
          {isFlowering && <div className="flower-anim"><img src="/images/guk.png" /></div>}
        </div>
      )}

      {/* 영상 재생 (mo03.mp4) 및 X 버튼 복구 */}
      {activeMenu === 'video' && (
        <div className="video-full-viewport">
          <video src="/videos/mo03.mp4" autoPlay playsInline onEnded={startGallery} className="full-video-element" />
          <button className="exit-button-styled" onClick={startGallery}><X size={32} /></button>
        </div>
      )}

      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
           {currentScene === 'bong1intro' ? (
            <div className="video-full-viewport">
              <video src="/videos/bong1intro.mp4" autoPlay playsInline onEnded={handleBong1Exit} className="full-video-element" />
              <button className="exit-button-styled" onClick={handleBong1Exit}><X size={32} /></button>
            </div>
           ) : (
            <div className="flat-scene-wrapper">
              <img src={SCENE_CONFIG[currentScene].img} className="flat-scene-img" />
              {currentScene === 'select' && (
                <>
                    <button className="hotspot-btn" style={{left: '25%', top: '50%'}} onClick={() => setCurrentScene('bong1intro')}>봉안당 1</button>
                    <button className="hotspot-btn" style={{left: '50%', top: '75%'}}>봉안당 2</button>
                    <button className="hotspot-btn" style={{left: '75%', top: '50%'}}>봉안당 3</button>
                </>
              )}
              {currentScene === 'yu' && <div className="min-seong-clickbox" onClick={() => setCurrentScene('per')}></div>}
              <button className="exit-button-styled" onClick={() => setCurrentScene('select')}><X size={32} /></button>
              <div className="scene-title-badge">{SCENE_CONFIG[currentScene].title}</div>
            </div>
           )}
        </div>
      )}

      <style jsx global>{`
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
        .app-container { width: 100vw; height: 100vh; }
        .main-viewport { position: relative; width: 100%; height: 100%; }
        .full-bg-mobile, .full-bg-desktop { width: 100%; height: 100%; object-fit: cover; }
        .full-bg-desktop { display: none; }
        @media (min-width: 769px) { .full-bg-mobile { display: none; } .full-bg-desktop { display: block; } }
        .main-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 50px; }
        .main-title { font-size: 3rem; color: white; margin: 0; }
        .bottom-menu { display: flex; gap: 20px; align-self: flex-start; }
        .bottom-menu button { background: none; border: none; color: white; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
        .video-full-viewport { position: fixed; inset: 0; z-index: 200; background: #000; }
        .full-video-element { width: 100%; height: 100%; object-fit: cover; }
        /* 예전 X 버튼 스타일 복구 */
        .exit-button-styled { position: absolute; top: 30px; right: 30px; z-index: 210; background: rgba(0,0,0,0.5); border: 1px solid white; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .flat-scene-wrapper { width: 100vw; height: 100vh; position: relative; }
        .flat-scene-img { width: 100%; height: 100%; object-fit: contain; }
        .hotspot-btn { position: absolute; background: rgba(0,0,0,0.7); color: white; border: 1px solid white; padding: 10px; }
        .scene-title-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; }
        .min-seong-clickbox { position: absolute; top: 15%; left: 40%; width: 20%; height: 30%; cursor: pointer; }
      `}</style>
    </div>
  );
}