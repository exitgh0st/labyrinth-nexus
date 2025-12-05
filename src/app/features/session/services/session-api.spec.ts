import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SessionApi, SessionListQuery } from './session-api';
import { Session } from '../models/session';
import { environment } from '../../../../environments/environment';

describe('SessionApi', () => {
  let service: SessionApi;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockSession: Session = {
    id: 1,
    userId: 'user123',
    token: 'token123',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    isRevoked: false,
    createdAt: '2024-01-01T00:00:00Z',
    lastUsedAt: '2024-01-01T12:00:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SessionApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('User Personal Session Methods', () => {
    describe('getMyActiveSessions', () => {
      it('should fetch current user active sessions', () => {
        const mockSessions: Session[] = [mockSession];

        service.getMyActiveSessions().subscribe(sessions => {
          expect(sessions).toEqual(mockSessions);
          expect(sessions.length).toBe(1);
        });

        const req = httpMock.expectOne(`${apiUrl}/auth/sessions`);
        expect(req.request.method).toBe('GET');
        expect(req.request.withCredentials).toBe(true);
        req.flush(mockSessions);
      });

      it('should handle errors when fetching sessions', () => {
        service.getMyActiveSessions().subscribe({
          next: () => fail('should have failed'),
          error: (error) => {
            expect(error.status).toBe(500);
          }
        });

        const req = httpMock.expectOne(`${apiUrl}/auth/sessions`);
        req.flush('Server Error', { status: 500, statusText: 'Server Error' });
      });
    });

    describe('revokeMySession', () => {
      it('should revoke a specific session', () => {
        const sessionId = 123;

        service.revokeMySession(sessionId).subscribe(response => {
          expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/auth/${sessionId}/revoke`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        expect(req.request.withCredentials).toBe(true);
        req.flush(null);
      });
    });

    describe('logoutAllMyDevices', () => {
      it('should logout from all devices', () => {
        service.logoutAllMyDevices().subscribe(response => {
          expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/auth/logout-all`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        expect(req.request.withCredentials).toBe(true);
        req.flush(null);
      });
    });

    describe('loadMyActiveSessions', () => {
      it('should load sessions and update signal', () => {
        const mockSessions: Session[] = [mockSession];

        service.loadMyActiveSessions();

        const req = httpMock.expectOne(`${apiUrl}/auth/sessions`);
        req.flush(mockSessions);

        expect(service.activeSessions()).toEqual(mockSessions);
      });

      it('should handle errors and log to console', () => {
        spyOn(console, 'error');

        service.loadMyActiveSessions();

        const req = httpMock.expectOne(`${apiUrl}/auth/sessions`);
        req.flush('Error', { status: 500, statusText: 'Server Error' });

        expect(console.error).toHaveBeenCalledWith('Failed to load sessions:', jasmine.any(Object));
      });
    });
  });

  describe('Admin Session Management Methods', () => {
    describe('getAllSessions', () => {
      it('should fetch all sessions without query parameters', () => {
        const mockResponse = {
          data: [mockSession],
          total: 1
        };

        service.getAllSessions().subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${apiUrl}/sessions`);
        expect(req.request.method).toBe('GET');
        expect(req.request.withCredentials).toBe(true);
        req.flush(mockResponse);
      });

      it('should fetch sessions with pagination parameters', () => {
        const query: SessionListQuery = { skip: 10, take: 20 };
        const mockResponse = { data: [mockSession], total: 100 };

        service.getAllSessions(query).subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(req =>
          req.url === `${apiUrl}/sessions` &&
          req.params.get('skip') === '10' &&
          req.params.get('take') === '20'
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
      });

      it('should fetch sessions with all filter parameters', () => {
        const query: SessionListQuery = {
          skip: 0,
          take: 10,
          userId: 'user123',
          isRevoked: true,
          ipAddress: '192.168.1.1'
        };

        service.getAllSessions(query).subscribe();

        const req = httpMock.expectOne(req =>
          req.url === `${apiUrl}/sessions` &&
          req.params.get('skip') === '0' &&
          req.params.get('take') === '10' &&
          req.params.get('userId') === 'user123' &&
          req.params.get('isRevoked') === 'true' &&
          req.params.get('ipAddress') === '192.168.1.1'
        );
        expect(req.request.method).toBe('GET');
        req.flush({ data: [], total: 0 });
      });

      it('should handle isRevoked as false', () => {
        const query: SessionListQuery = { isRevoked: false };

        service.getAllSessions(query).subscribe();

        const req = httpMock.expectOne(req =>
          req.url === `${apiUrl}/sessions` &&
          req.params.get('isRevoked') === 'false'
        );
        req.flush({ data: [], total: 0 });
      });
    });

    describe('revokeSession', () => {
      it('should revoke a specific session (admin)', () => {
        const sessionId = 456;

        service.revokeSession(sessionId).subscribe(response => {
          expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/sessions/${sessionId}/revoke`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({});
        expect(req.request.withCredentials).toBe(true);
        req.flush(null);
      });
    });

    describe('revokeAllUserSessions', () => {
      it('should revoke all sessions for a specific user', () => {
        const userId = 'user123';

        service.revokeAllUserSessions(userId).subscribe(response => {
          expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/sessions/user/${userId}/revoke-all`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({});
        expect(req.request.withCredentials).toBe(true);
        req.flush(null);
      });
    });

    describe('deleteSession', () => {
      it('should delete a specific session', () => {
        const sessionId = 789;

        service.deleteSession(sessionId).subscribe(response => {
          expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne(`${apiUrl}/sessions/${sessionId}`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.withCredentials).toBe(true);
        req.flush(null);
      });
    });

    describe('cleanupExpiredSessions', () => {
      it('should cleanup expired sessions and return count', () => {
        const mockResponse = { deletedCount: 15 };

        service.cleanupExpiredSessions().subscribe(response => {
          expect(response).toEqual(mockResponse);
          expect(response.deletedCount).toBe(15);
        });

        const req = httpMock.expectOne(`${apiUrl}/sessions/cleanup/expired`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.withCredentials).toBe(true);
        req.flush(mockResponse);
      });
    });

    describe('cleanupRevokedSessions', () => {
      it('should cleanup revoked sessions with default days parameter', () => {
        const mockResponse = { deletedCount: 10 };

        service.cleanupRevokedSessions().subscribe(response => {
          expect(response).toEqual(mockResponse);
          expect(response.deletedCount).toBe(10);
        });

        const req = httpMock.expectOne(req =>
          req.url === `${apiUrl}/sessions/cleanup/revoked` &&
          req.params.get('days') === '30'
        );
        expect(req.request.method).toBe('DELETE');
        expect(req.request.withCredentials).toBe(true);
        req.flush(mockResponse);
      });

      it('should cleanup revoked sessions with custom days parameter', () => {
        const mockResponse = { deletedCount: 5 };
        const customDays = 60;

        service.cleanupRevokedSessions(customDays).subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(req =>
          req.url === `${apiUrl}/sessions/cleanup/revoked` &&
          req.params.get('days') === '60'
        );
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
      });
    });
  });

  describe('activeSessions signal', () => {
    it('should initialize with empty array', () => {
      expect(service.activeSessions()).toEqual([]);
    });

    it('should update activeSessions signal', () => {
      const mockSessions: Session[] = [mockSession];
      service.activeSessions.set(mockSessions);
      expect(service.activeSessions()).toEqual(mockSessions);
    });
  });
});
