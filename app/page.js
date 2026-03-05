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
  const [activeMenu, setActiveMenu] = useState('main'); // main, video, gallery
  const [currentScene, setCurrentScene] = useState('select');
  const [hasFlowered, setHasFlowered] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState([]);
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  // 헌화하기 완벽 복구
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

  // 영상 종료 시 건물선택(select.jpg) 화면으로 이동
  const handleMo03Exit = () => {
    setActiveMenu('gallery');
    setCurrentScene('select');
  };

  // 각 씬의 X 버튼 로직
  const handleExit = () => {
    if (currentScene === 'select') {
      setActiveMenu('main'); // 건물 선택 -> 메인화면
    } else if (currentScene === 'bong1intro') {
      setCurrentScene('yu'); // 봉안당1 영상 중 X -> 유골함
    } else if (currentScene === 'yu') {
      setCurrentScene('select'); // 유골함에서 X -> 건물 선택
    } else if (currentScene === 'per') {
      setCurrentScene('yu'); // 개인추모실에서 X -> 유골함
    } else {
      setCurrentScene('select');
    }
  };

  // 개인추모실(per) 파노라마 뷰어 복구
  useEffect(() => {
    if (pannellumInstance.current) {
      pannellumInstance.current.destroy();
      pannellumInstance.current = null;
    }
    if (activeMenu === 'gallery' && currentScene === 'per' && isPannellumLoaded && window.pannellum) {
      if (viewerRef.current) {
        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: SCENE_CONFIG['per'].img,
          autoLoad: true,
          showControls: false,
          hfov: 100
        });
      }
    }
  }, [activeMenu, currentScene, isPannellumLoaded]);

  return (
    <div className="app-container">
      {/* 파노라마용 스크립트 복구 */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" onLoad={() => setIsPannellumLoaded(true)} />

      {/* 1. 메인화면 (중앙 검정 글씨, 우측 정렬 1.5배 메뉴) */}
      {activeMenu === 'main' && (
        <div className="main-viewport">
          <img src="/images/main.jpg" className="full-bg-mobile" alt="main mobile" />
          <img src="/images/maindesk.jpg" className="full-bg-desktop" alt="main desktop" />
          
          <div className="main-overlay">
            <div className="text-container">
              <h1 className="main-title">추모관</h1>
              <p className="main-subtitle">영원한 안식, 함께 기억합니다.</p>
            </div>
            
            <div className="bottom-menu">
              <button onClick={handleFlower}><Flower2 size={45} color="white" /><span>헌화</span></button>
              <button onClick={() => setActiveMenu('video')}><Landmark size={45} color="white" /><span>추모관</span></button>
              <button><NotebookPen size={45} color="white" /><span>방명록</span></button>
            </div>
          </div>
          {isFlowering && <div className="flower-anim"><img src="/images/guk.png" alt="flower" /></div>}
        </div>
      )}

      {/* 2. 메인에서 넘어온 mo03.mp4 재생 화면 */}
      {activeMenu === 'video' && (
        <div className="video-full-viewport">
          <video src="/videos/mo03.mp4" autoPlay playsInline onEnded={handleMo03Exit} className="full-video-element" />
          <button className="exit-button" onClick={handleMo03Exit}><X size={32} color="white" /></button>
        </div>
      )}

      {/* 3. 갤러리 (건물선택, 봉안당1 영상, 유골함, 개인추모실) */}
      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          
          {currentScene === 'bong1intro' ? (
            <div className="video-full-viewport">
              {/* 봉안당1 영상: 끝나면 yu(유골함)으로 */}
              <video src="/videos/bong1intro.mp4" autoPlay playsInline onEnded={() => setCurrentScene('yu')} className="full-video-element" />
              <button className="exit-button" onClick={() => setCurrentScene('yu')}><X size={32} color="white" /></button>
            </div>
          ) : (
            <div className="flat-scene-wrapper">
              
              {/* 배경 이미지 또는 파노라마 */}
              {SCENE_CONFIG[currentScene]?.isPanorama ? (
                <div ref={viewerRef} className="viewer-canvas" />
              ) : (
                <img src={SCENE_CONFIG[currentScene].img} className="flat-scene-img" alt="scene" />
              )}

              {/* 건물 선택 핫스팟 (정확히 중심 정렬 적용) */}
              {currentScene === 'select' && (
                <>
                  <button className="hotspot-btn" style={{left: '30%', top: '55%'}} onClick={() => setCurrentScene('bong1intro')}>봉안당 1</button>
                  <button className="hotspot-btn" style={{left: '52%', top: '80%'}}>봉안당 2</button>
                  <button className="hotspot-btn" style={{left: '73%', top: '55%'}}>봉안당 3</button>
                </>
              )}

              {/* 유골함 클릭 영역 (예전 그대로) */}
              {currentScene === 'yu' && <div className="min-seong-clickbox" onClick={() => setCurrentScene('per')}></div>}

              {/* 공통 X 버튼 및 뱃지 (예전 형식 그대로 복구) */}
              <button className="exit-button" onClick={handleExit}><X size={32} color="white" /></button>
              {SCENE_CONFIG[currentScene]?.title && <div className="scene-title-badge">{SCENE_CONFIG[currentScene].title}</div>}
              
            </div>
          )}
        </div>
      )}

      {/* 헌화 토스트 메시지 복구 */}
      {showToast && (
        <div className="toast-center">
          {toastMessage.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      {/* CSS 스타일링 완벽 복구 */}
      <style jsx global>{`
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: 'Noto Serif KR', serif; }
        .app-container { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
        
        /* 메인 화면 이미지 */
        .main-viewport { position: relative; width: 100%; height: 100%; overflow: hidden; }
        .full-bg-mobile { display: block; width: 100%; height: 100%; object-fit: cover; }
        .full-bg-desktop { display: none; width: 100%; height: 100%; object-fit: cover; }
        @media (min-width: 769px) {
          .full-bg-mobile { display: none; }
          .full-bg-desktop { display: block; }
        }

        /* 메인 오버레이 (정렬 및 글씨색 수정) */
        .main-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 10vh 5vw; pointer-events: none; }
        .main-overlay > * { pointer-events: auto; }
        
        .text-container { text-align: center; width: 100%; }
        .main-title { font-size: 5rem; color: #000; font-weight: bold; margin: 0; text-shadow: 0 0 10px rgba(255,255,255,0.8); }
        .main-subtitle { font-size: 1.5rem; color: #000; font-weight: bold; margin-top: 10px; text-shadow: 0 0 10px rgba(255,255,255,0.8); }
        
        .bottom-menu { display: flex; justify-content: flex-end; gap: 60px; width: 100%; padding-right: 2vw; }
        .bottom-menu button { background: none; border: none; color: white; display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); }
        .bottom-menu button span { font-size: 1.5rem; font-weight: bold; }

        /* 헌화 애니메이션 복구 */
        .flower-anim { position: absolute; left: 50%; bottom: 25%; transform: translateX(-50%); z-index: 20; animation: flower-up 2.6s forwards; pointer-events: none; }
        .flower-anim img { width: 150px; }
        @keyframes flower-up { 0% { bottom: 25%; opacity: 0; } 20% { opacity: 1; } 100% { bottom: 60%; opacity: 0; } }

        /* 비디오 및 갤러리 */
        .video-full-viewport { position: fixed; inset: 0; z-index: 200; background: #000; }
        .full-video-element { width: 100%; height: 100%; object-fit: cover; }
        .gallery-full-viewport { position: fixed; inset: 0; z-index: 100; background: #000; }
        
        .flat-scene-wrapper { position: absolute; inset: 0; width: 100vw; height: 100vh; }
        .flat-scene-img { width: 100%; height: 100%; object-fit: contain; }
        .viewer-canvas { position: absolute; inset: 0; width: 100%; height: 100%; background: #000; }

        /* UI 컴포넌트 */
        .hotspot-btn { position: absolute; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); border: 2px solid #ef4444; color: white; padding: 10px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.2rem; z-index: 120; }
        
        /* 찌그러짐 없는 예전 X 버튼 복구 */
        .exit-button { position: absolute; top: 30px; right: 30px; z-index: 250; background: rgba(0,0,0,0.5); border: 1px solid #fff; border-radius: 50%; width: 50px; height: 50px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; box-sizing: border-box; }
        
        /* 유골함, 개인추모실 예전 뱃지 스타일 복구 */
        .scene-title-badge { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); border: 2px solid #ef4444; color: white; padding: 10px 30px; border-radius: 8px; font-weight: bold; font-size: 1.2rem; z-index: 130; }
        
        .min-seong-clickbox { position: absolute; top: 15%; left: 40%; width: 20%; height: 30%; cursor: pointer; z-index: 115; }
        
        /* 토스트 메시지 복구 */
        .toast-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 22px 45px; border-radius: 20px; z-index: 500; text-align: center; font-size: 1.2rem; line-height: 1.5; }
      `}</style>
    </div>
  );
}