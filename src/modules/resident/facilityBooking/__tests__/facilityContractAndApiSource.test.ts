import { facilityApiSource } from '../data/facility.apiSource';
import { facilityMockSource } from '../data/facility.mockSource';
import { facilityDtoDecoder, facilityBookingDtoDecoder, type FacilityDto } from '../data/facility.dto';
import { mapFacilityDtoToDomain, mapFacilityBookingDtoToDomain } from '../data/facility.mapper';
import { decodeOrThrow, ApiContractError } from '../../../../core/api/decoders';
import { apiClient } from '../../../../core/api/apiClient';

describe('Facility Production Data Architecture & Contract Certification', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Contract Equivalence', () => {
    it('proves facilityMockSource and facilityApiSource implement the exact same interface', () => {
      const mockRepo = facilityMockSource;
      const apiRepo = facilityApiSource;

      expect(typeof mockRepo.getFacilities).toBe('function');
      expect(typeof apiRepo.getFacilities).toBe('function');

      expect(typeof mockRepo.getFacilityDetail).toBe('function');
      expect(typeof apiRepo.getFacilityDetail).toBe('function');

      expect(typeof mockRepo.createFacilityBooking).toBe('function');
      expect(typeof apiRepo.createFacilityBooking).toBe('function');

      expect(typeof mockRepo.getMyBookings).toBe('function');
      expect(typeof apiRepo.getMyBookings).toBe('function');
    });
  });

  describe('DTO Decoding & Mapping Pipeline', () => {
    it('decodes and maps a valid facility DTO to domain model', () => {
      const validDto = {
        id: 'fac-badminton-01',
        name: 'Badminton Court 1',
        category: 'SPORTS',
        status: 'AVAILABLE',
        operatingHours: '06:00 AM - 10:00 PM',
        chargeAmount: 100,
        depositAmount: 0,
      };

      const decoded = decodeOrThrow(facilityDtoDecoder, validDto, 'test.facility');
      expect(decoded.id).toBe('fac-badminton-01');
      expect(decoded.name).toBe('Badminton Court 1');

      const domain = mapFacilityDtoToDomain(decoded);
      expect(domain.id).toBe('fac-badminton-01');
      expect(domain.name).toBe('Badminton Court 1');
      expect(domain.status).toBe('AVAILABLE');
    });

    it('rejects malformed facility payload missing name with ApiContractError', () => {
      const badPayload = {
        id: 'fac-tennis-01',
      };

      expect(() => decodeOrThrow(facilityDtoDecoder, badPayload, 'test.facility')).toThrow(ApiContractError);
    });

    it('decodes and maps facility booking DTO', () => {
      const bookingDto = {
        id: 'bk-555',
        bookingNumber: 'BK-555',
        facilityId: 'fac-tennis-01',
        facilityName: 'Tennis Court',
        date: '2026-10-25',
        slot: '05:00 PM - 06:00 PM',
        status: 'CONFIRMED',
        unitId: 'unit-b804',
        flatNumber: 'B-804',
      };

      const decoded = decodeOrThrow(facilityBookingDtoDecoder, bookingDto, 'test.booking');
      expect(decoded.id).toBe('bk-555');
      expect(decoded.facilityName).toBe('Tennis Court');

      const domain = mapFacilityBookingDtoToDomain(decoded);
      expect(domain.id).toBe('bk-555');
      expect(domain.status).toBe('CONFIRMED');
    });
  });

  describe('ApiFacilityRepository Transport Resilience', () => {
    it('returns repositoryFailure with VALIDATION category when facilities payload is malformed', async () => {
      const malformedFacility = { id: 'missing-name' };
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce([malformedFacility] as never);

      const result = await facilityApiSource.getFacilities();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('VALIDATION');
        expect(result.error.code).toBe('CONTRACT_VIOLATION');
      }
    });

    it('returns repositoryFailure with normalized error when server returns 404', async () => {
      const notFoundErr = Object.assign(new Error('Facility not found'), {
        status: 404,
        code: 'NOT_FOUND',
      });

      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(notFoundErr);

      const result = await facilityApiSource.getFacilityDetail('unknown-facility');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('NOT_FOUND');
      }
    });
  });
});
