import { complaintApiSource } from '../data/complaints.apiSource';
import { complaintMockSource } from '../data/complaints.mockSource';
import { complaintDtoDecoder } from '../data/complaint.dto';
import { mapComplaintDtoToDomain } from '../data/complaint.mapper';
import { decodeOrThrow, ApiContractError } from '../../../../core/api/decoders';
import { apiClient } from '../../../../core/api/apiClient';
import type { ResidentComplaintsRepository } from '../data/residentComplaints.repository.types';

describe('Complaint Production Data Architecture & Contract Certification', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Contract Equivalence', () => {
    it('proves complaintMockSource and complaintApiSource implement the exact same ResidentComplaintsRepository interface', () => {
      const mockRepo: ResidentComplaintsRepository = complaintMockSource;
      const apiRepo: ResidentComplaintsRepository = complaintApiSource;

      expect(typeof mockRepo.list).toBe('function');
      expect(typeof apiRepo.list).toBe('function');

      expect(typeof mockRepo.detail).toBe('function');
      expect(typeof apiRepo.detail).toBe('function');

      expect(typeof mockRepo.create).toBe('function');
      expect(typeof apiRepo.create).toBe('function');

      expect(typeof mockRepo.updateStatus).toBe('function');
      expect(typeof apiRepo.updateStatus).toBe('function');
    });
  });

  describe('DTO Decoding & Mapping Pipeline', () => {
    it('successfully decodes and maps a valid complaint DTO to domain model', () => {
      const validDto = {
        id: 'comp-201',
        title: 'Elevator squeaking sound',
        description: 'Strange mechanical sound in Tower B elevator',
        category: 'LIFT',
        status: 'OPEN',
        priority: 'HIGH',
        location: 'Tower B Lift 1',
        flatNumber: 'B-804',
        residentName: 'Rohan Sharma',
        createdAt: '2026-10-10T08:00:00.000Z',
        updatedAt: '2026-10-10T08:00:00.000Z',
        slaText: 'Response within 4 hours',
        updates: [
          {
            id: 'upd-1',
            status: 'OPEN',
            note: 'Ticket raised',
            timestamp: '2026-10-10T08:00:00.000Z',
          },
        ],
      };

      const decoded = decodeOrThrow(complaintDtoDecoder, validDto, 'test.complaint');
      expect(decoded.id).toBe('comp-201');
      expect(decoded.title).toBe('Elevator squeaking sound');

      const domain = mapComplaintDtoToDomain(decoded);
      expect(domain.id).toBe('comp-201');
      expect(domain.status).toBe('OPEN');
      expect(domain.category).toBe('LIFT');
      expect(domain.updates).toHaveLength(1);
    });

    it('rejects malformed payload missing required ID with ApiContractError', () => {
      const badPayload = {
        title: 'Broken pipe',
        category: 'PLUMBING',
      };

      expect(() => decodeOrThrow(complaintDtoDecoder, badPayload, 'test.complaint')).toThrow(ApiContractError);
    });
  });

  describe('ApiComplaintRepository Transport Resilience', () => {
    it('returns repositoryFailure with VALIDATION category when server returns malformed JSON array', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce([
        { title: 'No ID Complaint' },
      ] as any);

      const result = await complaintApiSource.list();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('VALIDATION');
        expect(result.error.code).toBe('CONTRACT_VIOLATION');
      }
    });

    it('returns repositoryFailure with normalized error when server returns 404', async () => {
      const notFoundError = new Error('Complaint not found');
      (notFoundError as any).status = 404;
      (notFoundError as any).code = 'NOT_FOUND';

      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(notFoundError);

      const result = await complaintApiSource.detail('non-existent-comp');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('NOT_FOUND');
      }
    });
  });
});
