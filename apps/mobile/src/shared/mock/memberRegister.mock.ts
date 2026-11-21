import type { MemberRecord } from '../types/complianceCalendar.types';
import { includeWhenPresent } from "../utils/presentProperty";
export const mockMemberRegisterList: MemberRecord[] = [
    {
        id: 'res-001',
        unit: 'A-1204',
        name: 'Shashank Shirode',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'sh******@gmail.com',
        maskedPhone: '******5839'
    },
    {
        id: 'res-002',
        unit: 'B-502',
        name: 'Priya Sharma',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'pr******@yahoo.com',
        maskedPhone: '******1204'
    },
    {
        id: 'res-003',
        unit: 'B-1102',
        name: 'Vikram Rao',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'PROXY_ASSIGNED',
        ineligibilityReason: 'Proxy authorized to Deepak Rao',
        maskedEmail: 'vi******@gmail.com',
        maskedPhone: '******4928'
    },
    {
        id: 'res-004',
        unit: 'A-102',
        name: 'Amit Joshi',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'am******@gmail.com',
        maskedPhone: '******8372'
    },
    {
        id: 'res-005',
        unit: 'A-801',
        name: 'Kavita Desai',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'ka******@gmail.com',
        maskedPhone: '******9283'
    },
    {
        id: 'res-006',
        unit: 'B-404',
        name: 'Neha Kapoor',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'RESTRICTED',
        ineligibilityReason: 'Maintenance dues pending (> 3 months)',
        maskedEmail: 'ne******@outlook.com',
        maskedPhone: '******8391'
    },
    {
        id: 'res-007',
        unit: 'C-101',
        name: 'Rohan Deshmukh',
        type: 'TENANT',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'NOT_ELIGIBLE',
        ineligibilityReason: 'Tenant occupant cannot vote in owner-only resolutions',
        maskedEmail: 'ro******@gmail.com',
        maskedPhone: '******2738'
    },
    {
        id: 'res-008',
        unit: 'C-302',
        name: 'Rajesh Mehta',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'ra******@gmail.com',
        maskedPhone: '******8839'
    },
    {
        id: 'res-009',
        unit: 'A-601',
        name: 'Deepak Gupta',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'de******@gmail.com',
        maskedPhone: '******9102'
    },
    {
        id: 'res-010',
        unit: 'B-201',
        name: 'Sunil Patil',
        type: 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: 'ELIGIBLE',
        maskedEmail: 'su******@gmail.com',
        maskedPhone: '******7829'
    },
];
for (let i = 11; i <= 20; i++) {
    const isTenant = i % 3 === 0;
    mockMemberRegisterList.push({
        id: `res-0${i}`,
        unit: `C-${i}04`,
        name: `Member Resident ${i}`,
        type: isTenant ? 'TENANT' : 'OWNER',
        verificationStatus: 'VERIFIED',
        votingEligibility: isTenant ? 'NOT_ELIGIBLE' : 'ELIGIBLE',
        ...includeWhenPresent("ineligibilityReason", isTenant ? 'Tenant occupant' : undefined),
        maskedEmail: `me******@gmail.com`,
        maskedPhone: `******11${i}`
    });
}

