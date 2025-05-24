// app/page.tsx (또는 pages/index.tsx)

'use client'; // App Router를 사용하는 경우 클라이언트 컴포넌트로 명시

import { useState, FormEvent, useEffect, useRef } from 'react';
import Link from 'next/link';

// 로그 타입 정의 (백그라운드 로깅용)
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'USER_ACTION' | 'API_REQUEST' | 'API_RESPONSE' | 'SYSTEM' | 'PERFORMANCE';
  message: string;
  data?: any;
}

// 백그라운드 로깅 클래스 (사용자에게는 보이지 않음)
class ChatLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 50; // 메모리 절약을 위해 줄임

  log(level: LogEntry['level'], category: LogEntry['category'], message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined
    };
    
    this.logs.push(logEntry);
    
    // 개발 모드에서만 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      const consoleMessage = `[${logEntry.timestamp}] [${level}] [${category}] ${message}`;
      switch (level) {
        case 'ERROR':
          console.error(consoleMessage, data);
          break;
        case 'WARN':
          console.warn(consoleMessage, data);
          break;
        default:
          console.log(consoleMessage, data);
      }
    }
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export default function ChatPage() {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string | null; timestamp: string; requestId: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(350);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  
  // 백그라운드 로거
  const logger = useRef(new ChatLogger()).current;
  const requestStartTime = useRef<number>(0);
  const requestId = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

  const N8N_WEBHOOK_URL = 'https://surveys-kinda-profiles-terminology.trycloudflare.com/webhook-test/41fb0ed9-3ab6-4536-a150-d3f564b1c9eb';

  // 네트워크 상태 모니터링 및 음성 인식 초기화
  useEffect(() => {
    logger.log('INFO', 'SYSTEM', 'CarePilot Chat initialized');

    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 음성 인식 지원 확인
    initializeSpeechRecognition();

    // 리사이징 이벤트 리스너 추가
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.min(Math.max(250, e.clientX - 20), 600);
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isResizing]);

  // 리사이징 시작 함수
  const handleResizeStart = () => {
    setIsResizing(true);
  };

  // 음성 인식 초기화 함수
  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // English setting
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        logger.log('INFO', 'USER_ACTION', 'Voice recognition started');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        // Get the final result to prevent duplicates
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        
        // Only add if it's a final result
        if (event.results[lastResultIndex].isFinal) {
          setMessage(prev => prev + (prev ? ' ' : '') + transcript);
          logger.log('INFO', 'USER_ACTION', 'Voice input received', { transcript });
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        logger.log('ERROR', 'SYSTEM', 'Voice recognition error', { error: event.error });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        logger.log('INFO', 'SYSTEM', 'Voice recognition ended');
      };
      
      setSpeechSupported(true);
      logger.log('INFO', 'SYSTEM', 'Speech recognition supported');
    } else {
      setSpeechSupported(false);
      logger.log('WARN', 'SYSTEM', 'Speech recognition not supported');
    }
  };

  // 음성 입력 시작/중지 함수
  const toggleVoiceInput = () => {
    if (!speechSupported) {
      logger.log('WARN', 'USER_ACTION', 'Voice input attempted but not supported');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        logger.log('ERROR', 'SYSTEM', 'Failed to start voice recognition', { error });
      }
    }
  };

  const generateRequestId = (): string => {
    requestId.current += 1;
    return `req_${Date.now()}_${requestId.current}`;
  };

  // 봇 응답 포맷팅
  const formatBotResponse = (text: string): string => {
    if (!text) return text;
    
    let formatted = text;
    
    // 마크다운 헤더 형식을 HTML로 변환 (### 텍스트)
    formatted = formatted.replace(/^### (.+)$/gm, '<h3 style="font-size: 16px; font-weight: 600; color: #374151; margin: 15px 0 8px 0;">$1</h3>');
    
    // 마크다운 볼드 형식을 HTML로 변환
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 의료 정보 헤더 포맷팅 (색상 적용)
    formatted = formatted.replace(/(<strong>Patient Summary<\/strong>)/g, '<div style="color: #2563eb; font-size: 18px; margin-bottom: 10px;">$1</div>');
    formatted = formatted.replace(/(<strong>Medical History<\/strong>)/g, '<div style="color: #dc2626; font-size: 16px; margin: 15px 0 8px 0;">$1</div>');
    formatted = formatted.replace(/(<strong>Medications<\/strong>)/g, '<div style="color: #059669; font-size: 16px; margin: 15px 0 8px 0;">$1</div>');
    formatted = formatted.replace(/(<strong>Recent Visit<\/strong>)/g, '<div style="color: #7c2d12; font-size: 16px; margin: 15px 0 8px 0;">$1</div>');
    formatted = formatted.replace(/(<strong>Conversation Insights<\/strong>)/g, '<div style="color: #7c3aed; font-size: 16px; margin: 15px 0 8px 0;">$1</div>');
    
    // h3 태그에 특별한 색상 적용
    formatted = formatted.replace(/<h3([^>]*)>Medical History<\/h3>/g, '<h3$1 style="color: #dc2626; font-size: 16px; font-weight: 600; margin: 15px 0 8px 0;">Medical History</h3>');
    
    // 환자 기본 정보 필드들
    formatted = formatted.replace(/(<strong>(?:Name|User ID|Date of Birth|Gender):<\/strong>)/g, '<span style="color: #1f2937; font-weight: 600;">$1</span>');
    
    // 구분선 스타일링
    formatted = formatted.replace(/\s*---\s*/g, '<div style="border-top: 2px solid #e5e7eb; margin: 20px 0; padding-top: 15px;"></div>');
    
    // 불렛 포인트 스타일링
    formatted = formatted.replace(/\s*•\s+([^•\n]+)/g, '<div style="margin: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #3b82f6;">•</span>$1</div>');
    
    // 숫자 리스트 스타일링 (약물 목록 등)
    formatted = formatted.replace(/(\d+)\.\s+(<strong>.*?<\/strong>)/g, '<div style="margin: 12px 0; font-weight: 600; color: #374151;"><span style="color: #3b82f6; margin-right: 8px;">$1.</span>$2</div>');
    
    // 날짜 및 시간 강조
    formatted = formatted.replace(/(\d{4}-\d{2}-\d{2})/g, '<span style="background: #dbeafe; padding: 2px 6px; border-radius: 4px; font-weight: 500;">$1</span>');
    
    // 의사 이름 강조
    formatted = formatted.replace(/(Dr\.\s+[A-Za-z\s]+)/g, '<span style="color: #059669; font-weight: 600;">$1</span>');
    
    // 공백 및 줄바꿈 정리 (HTML 변환 전에 처리)
    formatted = formatted.replace(/[ \t]+/g, ' '); // 연속 공백을 하나로
    formatted = formatted.replace(/^\n+/, ''); // 시작 부분 줄바꿈 제거
    formatted = formatted.replace(/\n+$/, ''); // 끝 부분 줄바꿈 제거
    formatted = formatted.replace(/\n{3,}/g, '\n\n'); // 3개 이상 줄바꿈을 2개로 제한
    
    // 줄바꿈을 <br>로 변환
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    const currentRequestId = generateRequestId();
    const userMessage = message.trim();
    
    logger.log('INFO', 'USER_ACTION', 'Message sent', { messageLength: userMessage.length });

    setIsLoading(true);
    setError(null);
    requestStartTime.current = performance.now();
    
    const newChatEntry = { 
      user: userMessage, 
      bot: '...', 
      timestamp: new Date().toISOString(),
      requestId: currentRequestId
    };
    
    setChatHistory(prev => [...prev, newChatEntry]);
    setMessage('');

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const responseTime = performance.now() - requestStartTime.current;
      
      if (!response.ok) {
        throw new Error(`Service temporarily unavailable. Please try again later.`);
      }

      const data = await response.json();
      const botReply = data.reply || "Sorry, I didn't receive a response.";
      
      logger.log('INFO', 'API_RESPONSE', 'Response received', { responseTime: `${responseTime.toFixed(2)}ms` });
      
      setChatHistory(prev =>
        prev.map((chat) =>
          chat.requestId === currentRequestId 
            ? { ...chat, bot: botReply } 
            : chat
        )
      );

    } catch (err: any) {
      logger.log('ERROR', 'API_REQUEST', 'Request failed', { error: err.message });

      let userFriendlyError = "Connection error occurred. Please check your network and try again.";
      
      if (err.message?.includes('Failed to fetch')) {
        userFriendlyError = "Cannot connect to server. Please try again later.";
      }

      setError(userFriendlyError);
      
      setChatHistory(prev =>
        prev.map((chat) =>
          chat.requestId === currentRequestId 
            ? { ...chat, bot: `❌ ${userFriendlyError}` } 
            : chat
        )
      );

    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setError(null);
    logger.log('INFO', 'USER_ACTION', 'Chat history cleared');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      
      {/* 왼쪽 의사 스케줄 UI */}
      <div style={{
        flex: `0 0 ${leftPanelWidth}px`,
        minHeight: '500px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* 스케줄 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
          color: 'white',
          padding: '25px 30px',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '600',
            letterSpacing: '-0.5px'
          }}>
            Dr. SONG's Schedule
          </h2>
          <p style={{
            margin: '0',
            fontSize: '14px',
            opacity: '0.9'
          }}>
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })} • {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>

        {/* 스케줄 내용 */}
        <div style={{ padding: '25px 30px' }}>
          
          {/* 오늘의 수술 일정 */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              color: '#2c3e50',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🏥 Today's Surgeries
            </h3>
            <div>
              <div style={{
                background: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '8px',
                borderLeft: '4px solid #e74c3c'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                  09:00 - 11:30
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  Cardiac Bypass Surgery - Room 301
                </div>
                <div style={{ fontSize: '12px', color: '#e74c3c', marginTop: '2px' }}>
                  Patient: Kim, Min-jun (67)
                </div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '8px',
                borderLeft: '4px solid #f39c12'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                  14:00 - 16:00
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  Appendectomy - Room 205
                </div>
                <div style={{ fontSize: '12px', color: '#f39c12', marginTop: '2px' }}>
                  Patient: Lee, Soo-jin (34)
                </div>
              </div>
            </div>
          </div>

          {/* 다음 환자 예약 */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              color: '#2c3e50',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👥 Next Appointments
            </h3>
            <div>
              <div style={{
                background: '#e8f5e8',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '8px',
                borderLeft: '4px solid #28a745'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                  17:30 - Emily Johnson (Patient)
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  Park, Ji-hoon (45) - Follow-up
                </div>
              </div>
              <div style={{
                background: '#e3f2fd',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '8px',
                borderLeft: '4px solid #2196f3'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                  18:00 - Emergency Standby
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  On-call duty begins
                </div>
              </div>
            </div>
          </div>

          {/* 중요 알림 */}
          <div>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              color: '#2c3e50',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📋 Important Notes
            </h3>
            <div style={{
              background: '#fff3cd',
              padding: '12px 16px',
              borderRadius: '12px',
              borderLeft: '4px solid #ffc107'
            }}>
              <div style={{ fontSize: '13px', color: '#856404', lineHeight: '1.5' }}>
                • Pre-op meeting at 08:30<br/>
                • New medical equipment training at 12:00<br/>
                • Monthly review meeting at 19:00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 리사이저 */}
      <div
        onMouseDown={handleResizeStart}
        style={{
          width: '8px',
          cursor: 'col-resize',
          background: isResizing 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
          transition: isResizing ? 'none' : 'all 0.3s ease',
          boxShadow: isResizing 
            ? '0 0 10px rgba(102, 126, 234, 0.5)'
            : '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          alignSelf: 'stretch',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          width: '2px',
          height: '30px',
          background: isResizing ? 'white' : 'rgba(255, 255, 255, 0.6)',
          borderRadius: '1px',
          boxShadow: '0 0 2px rgba(0,0,0,0.2)'
        }}></div>
      </div>

      {/* 오른쪽 CarePilot Assistant */}
      <div style={{ 
        flex: '1',
        minWidth: '400px',
        background: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '20px', 
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* 헤더 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          padding: '30px 40px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '32px', 
            fontWeight: '600',
            letterSpacing: '-0.5px'
          }}>
            CarePilot Assistant
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '16px', 
            opacity: '0.9',
            fontWeight: '300'
          }}>
            AI-Powered Healthcare Support System
          </p>
          
          {/* 상태 표시 */}
          <div style={{ 
            marginTop: '20px',
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            fontSize: '14px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px'
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%',
                background: networkStatus === 'online' ? '#2ecc71' : '#e74c3c'
              }}></div>
              <span>{networkStatus === 'online' ? 'Online' : 'Offline'}</span>
            </div>
            <div style={{ 
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px'
            }}>
              {chatHistory.length} conversations
            </div>
            {speechSupported && (
              <div style={{ 
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🎤</span>
                <span>Voice Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div style={{ padding: '40px' }}>
          
          {/* Clear Chat 버튼 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: '20px' 
          }}>
            <button 
              onClick={clearChatHistory}
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                border: 'none',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(231, 76, 60, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
              }}
            >
              🗑️ Clear Chat
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ 
            height: '650px', 
            border: '1px solid rgba(0,0,0,0.1)', 
            borderRadius: '16px', 
            overflowY: 'auto', 
            padding: '20px', 
            marginBottom: '20px', 
            background: 'rgba(248, 249, 250, 0.8)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
          }}>
            {chatHistory.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#6c757d',
                marginTop: '150px',
                fontSize: '18px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: '500' }}>Welcome to CarePilot</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: '0.7' }}>
                  Start a conversation to get AI-powered healthcare assistance
                </p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} style={{ 
                  marginBottom: '25px', 
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
                }}>
                  
                  {/* User Message */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    marginBottom: '15px'
                  }}>
                    <div style={{ 
                      maxWidth: '70%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '16px 20px',
                      borderRadius: '20px 20px 4px 20px',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      fontSize: '15px',
                      lineHeight: '1.5'
                    }}>
                      <div style={{ 
                        fontSize: '12px', 
                        opacity: '0.8', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        Dr. SONG
                      </div>
                      {chat.user}
                    </div>
                  </div>

                  {/* Bot Response */}
                  {chat.bot && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-start'
                    }}>
                      <div style={{ 
                        maxWidth: '70%',
                        background: 'white',
                        border: '1px solid rgba(0,0,0,0.1)',
                        padding: '16px 20px',
                        borderRadius: '20px 20px 20px 4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '15px',
                        lineHeight: '1.6'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#28a745',
                          marginBottom: '8px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          🤖 CarePilot
                        </div>
                        <div style={{ 
                          color: '#2c3e50',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {chat.bot === '...' ? (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              fontStyle: 'italic',
                              color: '#6c757d'
                            }}>
                              <div style={{ 
                                width: '20px', 
                                height: '20px',
                                border: '2px solid #6c757d',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                              Thinking...
                            </div>
                          ) : (
                            <div 
                              style={{
                                lineHeight: '1.6',
                                color: '#2c3e50'
                              }}
                              dangerouslySetInnerHTML={{ 
                                __html: formatBotResponse(chat.bot) 
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} style={{ 
            display: 'flex', 
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <div style={{ flexGrow: 1, position: 'relative' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading || networkStatus === 'offline'}
                rows={3}
                style={{ 
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '2px solid rgba(0,0,0,0.1)',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  minHeight: '60px',
                  maxHeight: '120px',
                  background: 'white',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#2c3e50'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px' 
            }}>
              <button 
                type="submit" 
                disabled={isLoading || networkStatus === 'offline' || !message.trim()} 
                style={{ 
                  padding: '16px 24px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isLoading || networkStatus === 'offline' || !message.trim() 
                    ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isLoading || networkStatus === 'offline' || !message.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '100px',
                  height: '49px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Sending...
                  </>
                ) : networkStatus === 'offline' ? (
                  '📡 Offline'
                ) : (
                  <>🚀 Send</>
                )}
              </button>
              
              {/* 마이크 버튼 */}
              <button 
                type="button"
                onClick={toggleVoiceInput}
                disabled={!speechSupported || isLoading || networkStatus === 'offline'}
                style={{ 
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: !speechSupported || isLoading || networkStatus === 'offline'
                    ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
                    : isListening 
                      ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                      : 'linear-gradient(135deg, #28a745 0%, #20803d 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: !speechSupported || isLoading || networkStatus === 'offline' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '100px',
                  height: '49px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: isListening ? '0 0 20px rgba(231, 76, 60, 0.5)' : '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseOver={(e) => {
                  if (speechSupported && !isLoading && networkStatus === 'online') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {!speechSupported ? (
                  <>🚫 No Mic</>
                ) : isListening ? (
                  <>
                    <div style={{ 
                      width: '12px', 
                      height: '12px',
                      borderRadius: '50%',
                      background: 'white',
                      animation: 'pulse 1s ease-in-out infinite'
                    }}></div>
                    Stop
                  </>
                ) : (
                  <>🎤 Voice</>
                )}
              </button>
            </div>
          </form>

          {/* 에러 메시지 */}
          {error && (
            <div style={{ 
              marginTop: '20px', 
              padding: '16px 20px', 
              background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
              border: '1px solid #f8bbd9',
              borderRadius: '12px',
              color: '#c62828',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Connection Issue</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* 환자 정보 페이지로 이동 버튼 */}
          <div style={{ 
            padding: '20px 30px 30px 30px',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Link 
              href="/patients"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #28a745 0%, #20853d 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
              }}
            >
              📋 View Patient Information
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        textarea::placeholder {
          color: #6c757d !important;
          opacity: 1 !important;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}