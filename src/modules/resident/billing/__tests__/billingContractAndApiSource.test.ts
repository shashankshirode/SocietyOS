import { billApiSource } from '../data/billing.apiSource';
import { billMockSource } from '../data/billing.mockSource';
import { billDtoDecoder, mockPaymentConfirmationDecoder } from '../data/bill.dto';
import { mapBillDtoToDomain } from '../data/bill.mapper';
import { decodeOrThrow, ApiContractError } from '../../../../core/api/decoders';
import { apiClient } from '../../../../core/api/apiClient';
import type { ResidentBillingRepository } from '../data/residentBilling.repository.types';

describe('Billing Production Data Architecture & Contract Certification', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Contract Equivalence', () => {
    it('proves billMockSource and billApiSource implement the exact same ResidentBillingRepository interface', () => {
      const mockRepo: ResidentBillingRepository = billMockSource;
      const apiRepo: ResidentBillingRepository = billApiSource;

      expect(typeof mockRepo.getBillsPage).toBe('function');
      expect(typeof apiRepo.getBillsPage).toBe('function');

      expect(typeof mockRepo.getBillDetail).toBe('function');
      expect(typeof apiRepo.getBillDetail).toBe('function');

      expect(typeof mockRepo.getBillSummary).toBe('function');
      expect(typeof apiRepo.getBillSummary).toBe('function');

      expect(typeof mockRepo.mockPayment).toBe('function');
      expect(typeof apiRepo.mockPayment).toBe('function');
    });
  });

  describe('DTO Decoding & Mapping Pipeline', () => {
    it('decodes and maps a valid bill DTO to domain model with charges', () => {
      const validDto = {
        id: 'bill-101',
        title: 'October 2026 Maintenance',
        amount: 3200,
        dueDate: '2026-10-31',
        status: 'DUE',
        charges: [
          {
            id: 'chg-1',
            title: 'Society Maintenance',
            amount: 3000,
            currencyCode: 'INR',
          },
          {
            id: 'chg-2',
            title: 'Sinking Fund',
            amount: 200,
            currencyCode: 'INR',
          },
        ],
      };

      const decoded = decodeOrThrow(billDtoDecoder, validDto, 'test.bill');
      expect(decoded.id).toBe('bill-101');
      expect(decoded.amount).toBe(3200);

      const domain = mapBillDtoToDomain(decoded);
      expect(domain.id).toBe('bill-101');
      expect(domain.amount).toBe(3200);
      expect(domain.status).toBe('DUE');
      expect(domain.charges).toHaveLength(2);
    });

    it('rejects malformed bill payload missing ID with ApiContractError', () => {
      const badPayload = {
        title: 'Missing ID Bill',
        amount: 2000,
      };

      expect(() => decodeOrThrow(billDtoDecoder, badPayload, 'test.bill')).toThrow(ApiContractError);
    });

    it('decodes mock payment confirmation', () => {
      const paymentDto = {
        transactionId: 'tx-12345',
        receiptNumber: 'REC-0987',
        paymentDate: '2026-10-15T10:00:00.000Z',
      };

      const decoded = decodeOrThrow(mockPaymentConfirmationDecoder, paymentDto, 'test.payment');
      expect(decoded.transactionId).toBe('tx-12345');
      expect(decoded.receiptNumber).toBe('REC-0987');
    });
  });

  describe('ApiBillingRepository Transport Resilience', () => {
    const mockContext: any = {
      activeHome: {
        societyId: 'soc-palm-grove-01',
        unitId: 'unit-b804',
        residentRole: 'owner',
      },
    };

    it('returns repositoryFailure with VALIDATION category when bills page payload is malformed', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce({
        bills: 'not an array', // malformed
        hasMore: false,
      } as any);

      const result = await billApiSource.getBillsPage(mockContext, { filter: 'all', pageSize: 10 });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('VALIDATION');
        expect(result.error.code).toBe('CONTRACT_VIOLATION');
      }
    });

    it('returns repositoryFailure with normalized error when server returns 404', async () => {
      const notFoundErr = new Error('Bill not found');
      (notFoundErr as any).status = 404;
      (notFoundErr as any).code = 'NOT_FOUND';

      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(notFoundErr);

      const result = await billApiSource.getBillDetail(mockContext, 'non-existent-bill');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.category).toBe('NOT_FOUND');
      }
    });
  });
});
