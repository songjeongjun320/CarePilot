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

      {/* 메인 컨텐츠 - 2컬럼 레이아웃 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        minHeight: '100vh',
        gap: '40px',
        padding: '40px'
      }}>
        
        {/* 왼쪽 컬럼 - 로고 & 문제점 */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}>
          
          {/* 로고 섹션 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '25px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              color: 'white',
              padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '15px',
                flexWrap: 'wrap'
              }}>
                <img 
                  src="/CarePilotLogo.png" 
                  alt="CarePilot Logo"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    animation: 'logoSpin 10s linear infinite'
                  }}
                />
                <div>
                  <h1 style={{
                    margin: '0',
                    fontSize: '36px',
                    fontWeight: '700',
                    letterSpacing: '-1px'
                  }}>
                    CarePilot
                  </h1>
                  <p style={{
                    margin: '5px 0 0 0',
                    fontSize: '16px',
                    opacity: '0.9',
                    fontWeight: '300'
                  }}>
                    AI-Powered Healthcare Assistant
                  </p>
                </div>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <span style={{
                  padding: '3px 10px',
                  background: '#28a745',
                  borderRadius: '10px',
                  fontSize: '11px'
                }}>
                  v1.0.0
                </span>
                <span>🩺 Healthcare Ready</span>
                <span>🤖 AI Powered</span>
              </div>
            </div>
          </div>

          {/* 문제점 섹션 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '25px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            flex: '1'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
              padding: '30px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #feb2b2'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                color: '#c53030',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Current Problem in Healthcare
              </h2>
              
              <h3 style={{
                fontSize: '18px',
                color: '#2d3748',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                🩺 Doctors Face Daily Challenges:
              </h3>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#4a5568',
                flex: '1'
              }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  📄 <div><strong>Heavy paperwork</strong> that consumes valuable time</div>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  📝 <div><strong>Manual data entry</strong> that slows down workflow</div>
                </li>
                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  ✏️ <div><strong>Real-time note-taking</strong> during consultations that splits focus</div>
                </li>
              </ul>
              
              <div style={{
                background: '#f7fafc',
                padding: '15px 20px',
                borderRadius: '12px',
                borderLeft: '4px solid #e53e3e',
                fontSize: '15px',
                fontStyle: 'italic',
                color: '#2d3748',
                textAlign: 'center',
                marginTop: 'auto'
              }}>
                "Doctors spend up to <strong>50% of their time</strong> on documentation."
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 해결책 & 기능들 */}
        <div style={{
          flex: '1',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '25px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* 해결책 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h2 style={{
              margin: '0 0 10px 0',
              fontSize: '28px',
              fontWeight: '600'
            }}>
              AI Voice-Enabled Doctor Assistant
            </h2>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 10px 0',
              opacity: '0.95'
            }}>
              CarePilot = More Time. Better Care. Scalable Impact.
            </p>
            <p style={{
              fontSize: '14px',
              margin: '0',
              opacity: '0.9',
              lineHeight: '1.5'
            }}>
              What if we could automate these tasks? What if doctors could spend more time on 
              <strong> patient care</strong>, not <strong>paperwork</strong>?
            </p>
          </div>

          {/* 기능 카드들 */}
          <div style={{
            padding: '30px',
            flex: '1',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              flex: '1'
            }}>
              
              <div style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid #e1f5fe',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '16px',
                  color: '#1976d2',
                  fontWeight: '600'
                }}>
                  Instant Patient Summaries
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#424242',
                  lineHeight: '1.4',
                  flex: '1'
                }}>
                  Cuts through medical history clutter to deliver concise, actionable insights.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid #e8f5e8',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎤</div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '16px',
                  color: '#388e3c',
                  fontWeight: '600'
                }}>
                  Voice-to-Structured Notes
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#424242',
                  lineHeight: '1.4',
                  flex: '1'
                }}>
                  Turns conversations into clinical notes and AI-recommended next steps.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid #fff3e0',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📅</div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '16px',
                  color: '#f57500',
                  fontWeight: '600'
                }}>
                  Schedule Integration
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#424242',
                  lineHeight: '1.4',
                  flex: '1'
                }}>
                  Seamlessly manages calendars, reducing workflow friction.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f3e8ff 0%, #d6bcfa 100%)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid #e9d5ff',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🤖</div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '16px',
                  color: '#7c3aed',
                  fontWeight: '600'
                }}>
                  Voice-Driven Automation
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#424242',
                  lineHeight: '1.4',
                  flex: '1'
                }}>
                  Handles routine tasks, saving time and boosting efficiency.
                </p>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={handleDemoClick}
                style={{
                  padding: '16px 40px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }}
              >
                🚀 Experience CarePilot Demo
              </button>
              
              <p style={{
                margin: '0',
                fontSize: '12px',
                color: '#6c757d'
              }}>
                Click to experience the AI-powered healthcare assistant
              </p>

              {/* 푸터 정보 */}
              <div style={{
                marginTop: '20px',
                padding: '15px 0',
                borderTop: '1px solid #e2e8f0',
                fontSize: '11px',
                color: '#6c757d'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  © 2025 CarePilot Team. Transforming healthcare with AI.
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <span>🔒 HIPAA Compliant</span>
                  <span>⚡ Real-time</span>
                  <span>🌍 Global</span>
                </div>
              </div>
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