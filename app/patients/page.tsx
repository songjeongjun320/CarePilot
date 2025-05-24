'use client';

import { useState } from 'react';
import Link from 'next/link';

// 하드코딩된 환자 데이터
const mockPatients = [
  {
    id: 1,
    name: 'Emily Johnson',
    userID: '448346cf-381b-4d94-8d2f-649895f1a135',
    dateOfBirth: '1992-05-14',
    gender: 'Female',
    age: 31,
    phone: '+1 (555) 123-4567',
    email: 'emily.johnson@email.com',
    address: '123 Oak Street, Springfield, IL 62701',
    emergencyContact: 'Michael Johnson (Husband) - +1 (555) 987-6543',
    bloodType: 'O+',
    allergies: ['Peanuts', 'Pollen'],
    conditions: ['Asthma (seasonal flare-ups)', 'Allergic Rhinitis'],
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22 17:30',
    insurance: 'Blue Cross Blue Shield - Premium Plan',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Park Ji-hoon',
    userID: '892341cf-221b-3d84-7e2f-549895f2b246',
    dateOfBirth: '1978-11-23',
    gender: 'Male',
    age: 45,
    phone: '+1 (555) 234-5678',
    email: 'jihoon.park@email.com',
    address: '456 Maple Avenue, Chicago, IL 60601',
    emergencyContact: 'Sarah Park (Wife) - +1 (555) 876-5432',
    bloodType: 'A+',
    allergies: ['Penicillin'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-22 18:00',
    insurance: 'United Healthcare - Standard Plan',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Kim Min-jun',
    userID: '334567cf-445b-2d94-9e3f-749895f3c357',
    dateOfBirth: '1956-03-08',
    gender: 'Male',
    age: 67,
    phone: '+1 (555) 345-6789',
    email: 'minjun.kim@email.com',
    address: '789 Pine Road, Rockford, IL 61101',
    emergencyContact: 'Grace Kim (Daughter) - +1 (555) 765-4321',
    bloodType: 'B+',
    allergies: ['Shellfish', 'Latex'],
    conditions: ['Coronary Artery Disease', 'Osteoarthritis'],
    lastVisit: '2024-01-08',
    nextAppointment: 'Surgery Scheduled - 2024-01-22 09:00',
    insurance: 'Medicare + Supplemental',
    status: 'Pre-Surgery'
  },
  {
    id: 4,
    name: 'Lee Soo-jin',
    userID: '445678cf-556b-3e95-af4f-849895f4d468',
    dateOfBirth: '1989-09-17',
    gender: 'Female',
    age: 34,
    phone: '+1 (555) 456-7890',
    email: 'soojin.lee@email.com',
    address: '321 Cedar Lane, Peoria, IL 61602',
    emergencyContact: 'David Lee (Brother) - +1 (555) 654-3210',
    bloodType: 'AB+',
    allergies: ['None known'],
    conditions: ['Appendicitis (Acute)'],
    lastVisit: '2024-01-20',
    nextAppointment: 'Surgery Scheduled - 2024-01-22 14:00',
    insurance: 'Aetna - Premium Plan',
    status: 'Pre-Surgery'
  }
];

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.userID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '30px 40px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '32px',
            fontWeight: '600',
            color: '#2c3e50',
            letterSpacing: '-0.5px'
          }}>
            📋 Patient Information System
          </h1>
          <p style={{
            margin: '0',
            fontSize: '16px',
            color: '#6c757d'
          }}>
            Comprehensive patient data management for Dr. SONG
          </p>
        </div>
        <Link 
          href="/demo"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          ← Back to Demo
        </Link>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        display: 'flex',
        gap: '20px',
        height: 'calc(100vh - 140px)'
      }}>
        
        {/* 왼쪽 환자 리스트 */}
        <div style={{
          flex: '0 0 400px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* 검색 바 */}
          <div style={{
            padding: '25px 30px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              Patient List ({filteredPatients.length})
            </h3>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(0,0,0,0.1)',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          {/* 환자 리스트 */}
          <div style={{
            height: 'calc(100% - 120px)',
            overflowY: 'auto',
            padding: '20px 25px'
          }}>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  background: selectedPatient.id === patient.id 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(248, 249, 250, 0.8)',
                  color: selectedPatient.id === patient.id ? 'white' : '#2c3e50',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedPatient.id === patient.id 
                    ? '2px solid #667eea' 
                    : '1px solid rgba(0,0,0,0.1)',
                  boxShadow: selectedPatient.id === patient.id 
                    ? '0 8px 20px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  marginBottom: '4px'
                }}>
                  {patient.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  opacity: '0.8',
                  marginBottom: '4px'
                }}>
                  ID: {patient.userID.slice(0, 8)}... • Age: {patient.age}
                </div>
                <div style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  background: selectedPatient.id === patient.id 
                    ? 'rgba(255,255,255,0.2)'
                    : patient.status === 'Pre-Surgery'
                      ? 'rgba(231, 76, 60, 0.1)'
                      : 'rgba(40, 167, 69, 0.1)',
                  color: selectedPatient.id === patient.id 
                    ? 'white'
                    : patient.status === 'Pre-Surgery'
                      ? '#e74c3c'
                      : '#28a745',
                  display: 'inline-block',
                  fontWeight: '500'
                }}>
                  {patient.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 환자 상세 정보 */}
        <div style={{
          flex: '1',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* 환자 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            padding: '30px 40px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '28px',
                  fontWeight: '600'
                }}>
                  {selectedPatient.name}
                </h2>
                <p style={{
                  margin: '0 0 15px 0',
                  fontSize: '14px',
                  opacity: '0.9'
                }}>
                  Patient ID: {selectedPatient.userID}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  fontSize: '14px'
                }}>
                  <span>🎂 {selectedPatient.age} years old</span>
                  <span>📅 Born: {selectedPatient.dateOfBirth}</span>
                  <span>⚧ {selectedPatient.gender}</span>
                </div>
              </div>
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: selectedPatient.status === 'Pre-Surgery'
                  ? 'rgba(231, 76, 60, 0.2)'
                  : 'rgba(40, 167, 69, 0.2)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {selectedPatient.status}
              </div>
            </div>
          </div>

          {/* 환자 상세 정보 */}
          <div style={{
            padding: '40px',
            height: 'calc(100% - 150px)',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px'
            }}>
              
              {/* 기본 정보 */}
              <div>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  color: '#2c3e50',
                  fontWeight: '600',
                  borderBottom: '2px solid #e9ecef',
                  paddingBottom: '10px'
                }}>
                  📞 Contact Information
                </h3>
                <div style={{ lineHeight: '2', fontSize: '15px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#495057' }}>Phone:</strong><br/>
                    <span style={{ color: '#6c757d' }}>{selectedPatient.phone}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#495057' }}>Email:</strong><br/>
                    <span style={{ color: '#6c757d' }}>{selectedPatient.email}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#495057' }}>Address:</strong><br/>
                    <span style={{ color: '#6c757d' }}>{selectedPatient.address}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Emergency Contact:</strong><br/>
                    <span style={{ color: '#6c757d' }}>{selectedPatient.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* 의료 정보 */}
              <div>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  color: '#2c3e50',
                  fontWeight: '600',
                  borderBottom: '2px solid #e9ecef',
                  paddingBottom: '10px'
                }}>
                  🩺 Medical Information
                </h3>
                <div style={{ lineHeight: '2', fontSize: '15px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#495057' }}>Blood Type:</strong><br/>
                    <span style={{ 
                      color: '#white', 
                      background: '#dc3545',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>{selectedPatient.bloodType}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#495057' }}>Allergies:</strong><br/>
                    <span style={{ color: '#6c757d' }}>
                      {selectedPatient.allergies.join(', ') || 'None known'}
                    </span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#495057' }}>Current Conditions:</strong><br/>
                    {selectedPatient.conditions.map((condition, index) => (
                      <div key={index} style={{
                        background: '#fff3cd',
                        color: '#856404',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        marginTop: '4px',
                        fontSize: '14px'
                      }}>
                        • {condition}
                      </div>
                    ))}
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Insurance:</strong><br/>
                    <span style={{ color: '#6c757d' }}>{selectedPatient.insurance}</span>
                  </div>
                </div>
              </div>

              {/* 방문 기록 */}
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  color: '#2c3e50',
                  fontWeight: '600',
                  borderBottom: '2px solid #e9ecef',
                  paddingBottom: '10px'
                }}>
                  📅 Visit Information
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '30px',
                  fontSize: '15px'
                }}>
                  <div>
                    <strong style={{ color: '#495057' }}>Last Visit:</strong><br/>
                    <span style={{
                      background: '#d1ecf1',
                      color: '#0c5460',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      {selectedPatient.lastVisit}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Next Appointment:</strong><br/>
                    <span style={{
                      background: selectedPatient.nextAppointment.includes('Surgery') 
                        ? '#f8d7da' : '#d4edda',
                      color: selectedPatient.nextAppointment.includes('Surgery') 
                        ? '#721c24' : '#155724',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      {selectedPatient.nextAppointment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 