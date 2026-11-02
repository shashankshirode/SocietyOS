import { visitorsApiSource } from '../data/visitors.apiSource';
import { visitorsMockSource } from '../data/visitors.mockSource';
import { visitorDtoDecoder, visitorDtoListDecoder } from '../data/visitor.dto';
import { mapVisitorDtoToDomain } from '../data/visitor.mapper';
import { decodeOrThrow, ApiContractError } from '../../../../core/api/decoders';
import { apiClient } from '../../../../core/api/apiClient';
import { createApiSuccess } from '../../../../test/mockApiClient';
import type { ResidentVisitorsRepository } from '../data/residentVisitors.repository.types';

describe('Visitor Production Data Architecture & Contract Certification', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Contract Equivalence', () => {
    it('proves visitorsMockSource and visitorsApiSource implement the exact same ResidentVisitorsRepository interface', () => {
      const mockRepo: ResidentVisitorsRepository = visitorsMockSource;
      const apiRepo: ResidentVisitorsRepository = visitorsApiSource;

      expect(typeof mockRepo.list).toBe('function');
      expect(typeof apiRepo.list).toBe('function');

      expect(typeof mockRepo.detail).toBe('function');
      expect(typeof apiRepo.detail).toBe('function');

      expect(typeof mockRepo.create).toBe('function');
      expect(typeof apiRepo.create).toBe('function');

      expect(typeof mockRepo.updateStatus).toBe('function');
      expect(typeof apiRepo.updateStatus).toBe('function');

      expect(typeof mockRepo.confirmVisitorLeft).toBe('function');
      expect(typeof apiRepo.confirmVisitorLeft).toBe('function');

      expect(typeof mockRepo.cancelVisitorPass).toBe('function');
      expect(typeof apiRepo.cancelVisitorPass).toBe('function');
    });
  });

  describe('DTO Decoding & Mapping Pipeline', () => {
    it('successfully decodes and maps a valid visitor DTO to a rich domain entity', () => {
      const validDto = {
        id: 'vis-101',
        name: 'Kabir Mehta',
        phone: '+919876543210',
        type: 'GUEST',
        status: 'EXPECTED',
        expectedDate: '2026-10-15',
        expectedTime: '11:00 AM',
        flatNumber: 'B-804',
        societyName: 'Palm Grove',
        purpose: 'Family Visit',
        otp: '654321',
        createdAt: '2026-10-15T09:00:00.000Z',
      };

      const decoded = decodeOrThrow(visitorDtoDecoder, validDto, 'test.visitor');
      expect(decoded.id).toBe('vis-101');
      expect(decoded.name).toBe('Kabir Mehta');

      const domain = mapVisitorDtoToDomain(decoded);
      expect(domain.id).toBe('vis-101');
      expect(domain.name).toBe('Kabir Mehta');
      expect(domain.status).toBe('EXPECTED');
      expect(domain.exitTracking).toBeDefined();
      expect(domain.exitTracking?.exitStatus).toBe('notEntered');
    });

    it('rejects malformed payload missing required ID with ApiContractError', () => {
      const malformedPayload = {
        name: 'No ID Visitor',
        phone: '+919876543210',
        status: 'EXPECTED',
      };

      expect(() => decodeOrThrow(visitorDtoDecoder, malformedPayload, 'test.visitor')).toThrow(ApiContractError);
      try {
        decodeOrThrow(visitorDtoDecoder, malformedPayload, 'test.visitor');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiContractError);
        const err = error as ApiContractError;
        expect(err.path).toBe('test.visitor.id');
        expect(err.expected).toBe('string');
      }
    });

    it('rejects invalid enum values cleanly without passing corrupted state to domain layer', () => {
      const invalidStatusPayload = {
        id: 'vis-102',
        name: 'Invalid Status Visitor',
        status: 'COMPLETELY_INVALID_STATUS',
      };

      expect(() => decodeOrThrow(visitorDtoDecoder, invalidStatusPayload, 'test.visitor')).toThrow(ApiContractError);
    });
  });

  describe('ApiVisitorRepository Transport Resilience', () => {
    it('returns repositoryFailure with VALIDATION category when server returns malformed JSON array', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce([
        { name: 'Invalid item with no ID' }, // missing id
      ] as any);

      const result = await visitorsApiSource.list();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('VALIDATION');
        expect(result.error.retryable).toBe(false);
        expect(result.error.message).toContain('API Contract Violation');
      }
    });

    it('returns repositoryFailure with normalized error when server returns 404', async () => {
      const notFoundError = new Error('Visitor not found');
      (notFoundError as any).status = 404;
      (notFoundError as any).code = 'NOT_FOUND';

      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(notFoundError);

      const result = await visitorsApiSource.detail('non-existent-id');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('NOT_FOUND');
        expect(result.error.code).toBe('NOT_FOUND');
      }
    });

    it('successfully processes API response and maps to domain list on valid server response', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce([
        {
          id: 'vis-api-001',
          name: 'Pooja Varma',
          phone: '+919876543210',
          type: 'GUEST',
          status: 'EXPECTED',
          expectedDate: '2026-10-20',
          expectedTime: '04:00 PM',
          flatNumber: 'B-804',
          societyName: 'Palm Grove',
          purpose: 'Visit',
        },
      ]);

      const result = await visitorsApiSource.list();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0]?.id).toBe('vis-api-001');
        expect(result.data[0]?.name).toBe('Pooja Varma');
        expect(result.data[0]?.exitTracking).toBeDefined();
      }
    });
  });
});
