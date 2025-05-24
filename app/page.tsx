'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDemoClick = () => {
    router.push('/demo');
  };

  if (!mounted) {
    return null; // 서버사이드 렌더링 방지
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* 백그라운드 애니메이션 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      }} />

      {/* 메인 컨텐츠 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '30px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          animation: 'slideUp 1s ease-out'
        }}>
          
          {/* 헤더 섹션 */}
          <div style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            padding: '60px 40px',
            textAlign: 'center'
          }}>
            
            {/* 로고와 타이틀 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '25px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <img 
                src="/CarePilotLogo.png" 
                alt="CarePilot Logo"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '20px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  animation: 'logoSpin 10s linear infinite'
                }}
              />
              <div>
                <h1 style={{
                  margin: '0',
                  fontSize: '48px',
                  fontWeight: '700',
                  letterSpacing: '-1px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  CarePilot
                </h1>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '20px',
                  opacity: '0.9',
                  fontWeight: '300'
                }}>
                  AI-Powered Healthcare Assistant
                </p>
              </div>
            </div>

            {/* 버전 및 상태 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '15px',
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <span style={{
                padding: '4px 12px',
                background: '#28a745',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                v1.0.0
              </span>
              <span>🩺 Healthcare Ready</span>
              <span>🤖 AI Powered</span>
            </div>
          </div>

          {/* 본문 섹션 */}
          <div style={{ padding: '60px 40px' }}>
            
            {/* 프로젝트 소개 */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '32px',
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                혁신적인 의료 AI 어시스턴트
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6c757d',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                CarePilot은 의료진과 환자를 위한 차세대 AI 헬스케어 솔루션입니다. 
                인공지능 기술을 활용하여 의료 상담, 진단 보조, 환자 모니터링을 
                통합적으로 지원합니다.
              </p>
            </div>

            {/* 주요 기능 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              marginBottom: '50px'
            }}>
              
              <div style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid #e1f5fe',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(33, 150, 243, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🤖</div>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '20px',
                  color: '#1976d2',
                  fontWeight: '600'
                }}>
                  AI 진단 보조
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#424242',
                  lineHeight: '1.5'
                }}>
                  고도화된 AI 모델을 통해 의료진의 진단과 치료 계획 수립을 지원합니다.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid #e8f5e8',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '20px',
                  color: '#388e3c',
                  fontWeight: '600'
                }}>
                  실시간 상담
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#424242',
                  lineHeight: '1.5'
                }}>
                  24시간 언제든지 의료 상담과 건강 관리 조언을 받을 수 있습니다.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid #fff3e0',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 152, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '20px',
                  color: '#f57500',
                  fontWeight: '600'
                }}>
                  스마트 모니터링
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#424242',
                  lineHeight: '1.5'
                }}>
                  환자의 건강 상태를 지속적으로 모니터링하고 위험 요소를 조기 발견합니다.
                </p>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleDemoClick}
                style={{
                  padding: '20px 60px',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }}
              >
                🚀 CarePilot 체험하기
              </button>
              
              <p style={{
                margin: '20px 0 0 0',
                fontSize: '14px',
                color: '#6c757d'
              }}>
                * 클릭하여 AI 헬스케어 어시스턴트를 직접 체험해보세요
              </p>
            </div>
          </div>

          {/* 푸터 */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            padding: '30px 40px',
            textAlign: 'center',
            borderTop: '1px solid #dee2e6'
          }}>
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              © 2024 CarePilot Team. 혁신적인 헬스케어 솔루션을 제공합니다.
            </p>
            <div style={{
              marginTop: '15px',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '12px', color: '#adb5bd' }}>🔒 HIPAA Compliant</span>
              <span style={{ fontSize: '12px', color: '#adb5bd' }}>⚡ Real-time Processing</span>
              <span style={{ fontSize: '12px', color: '#adb5bd' }}>🌍 Global Healthcare</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(10px) rotate(-1deg);
          }
        }
        
        @keyframes logoSpin {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
} 