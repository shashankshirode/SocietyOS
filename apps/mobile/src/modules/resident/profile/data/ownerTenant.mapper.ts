import type { OwnerInfo, TenantInfo, FamilyMember, Vehicle, MoveInRequest } from '../../../../shared/types/ownerTenant.types';
import type { OccupancyTimelineEvent } from '../../../../shared/types/occupancy.types';
import type { OwnerInfoDto, TenantInfoDto, FamilyMemberDto, VehicleDto, OccupancyTimelineEventDto, MoveInRequestDto, } from './ownerTenant.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapOwnerDtoToDomain(dto: OwnerInfoDto): OwnerInfo {
    return {
        id: dto.id,
        name: dto.name,
        ownerType: dto.owner_type === 'PRIMARY' ? 'PRIMARY' : 'CO_OWNER',
        mobile: dto.mobile,
        email: dto.email,
        kycStatus: dto.kyc_status,
        ownershipStartDate: dto.ownership_start_date,
        ownershipType: dto.ownership_type,
        ...includeWhenPresent("shareCertificateNumber", dto.share_certificate_number),
        ...includeWhenPresent("saleDeedRegistrationNumber", dto.sale_deed_registration_number),
        parkingSlots: dto.parking_slots,
        emergencyContact: dto.emergency_contact,
        communicationPreference: dto.communication_preference,
        documentsCount: dto.documents_count
    };
}
export function mapTenantDtoToDomain(dto: TenantInfoDto): TenantInfo {
    return {
        id: dto.id,
        name: dto.name,
        mobile: dto.mobile,
        email: dto.email,
        agreementStartDate: dto.agreement_start_date,
        agreementEndDate: dto.agreement_end_date,
        moveInDate: dto.move_in_date,
        policeVerificationStatus: dto.police_verification_status,
        ownerApprovalStatus: dto.owner_approval_status,
        kycStatus: dto.kyc_status,
        rentAgreementStatus: dto.rent_agreement_status,
        accessStatus: dto.access_status,
        ...includeWhenPresent("nocStatus", dto.noc_status),
        documentsCount: dto.documents_count
    };
}
export function mapFamilyMemberDtoToDomain(dto: FamilyMemberDto): FamilyMember {
    return {
        id: dto.id,
        name: dto.name,
        relationship: dto.relationship,
        residentType: dto.resident_type,
        ...includeWhenPresent("mobile", dto.mobile),
        ageGroup: dto.age_group,
        appAccessStatus: dto.app_access_status,
        isEmergencyContact: dto.is_emergency_contact,
        moveInDate: dto.move_in_date,
        verificationStatus: dto.verification_status
    };
}
export function mapVehicleDtoToDomain(dto: VehicleDto): Vehicle {
    return {
        id: dto.id,
        type: dto.type,
        vehicleNumber: dto.vehicle_number,
        ownerDriverName: dto.owner_driver_name,
        linkedResidentName: dto.linked_resident_name,
        parkingSlot: dto.parking_slot,
        rfidReadinessStatus: dto.rfid_readiness_status,
        stickerStatus: dto.sticker_status,
        verificationStatus: dto.verification_status,
        ...includeWhenPresent("lastGateEntry", dto.last_gate_entry)
    };
}
export function mapTimelineEventDtoToDomain(dto: OccupancyTimelineEventDto): OccupancyTimelineEvent {
    return {
        id: dto.id,
        eventTitle: dto.event_title,
        eventType: dto.event_type,
        eventDate: dto.event_date,
        actorName: dto.actor_name,
        description: dto.description,
        ...includeWhenPresent("linkedReferenceId", dto.linked_reference_id),
        status: dto.status
    };
}
export function mapMoveInRequestDtoToDomain(dto: MoveInRequestDto): MoveInRequest {
    return {
        id: dto.id,
        residentType: dto.resident_type,
        unitId: dto.unit_id,
        moveInDate: dto.move_in_date,
        residentName: dto.resident_name,
        mobile: dto.mobile,
        ...includeWhenPresent("email", dto.email),
        vehicleCount: dto.vehicle_count,
        familyMemberCount: dto.family_member_count,
        liftSlotRequired: dto.lift_slot_required,
        truckEntryRequired: dto.truck_entry_required,
        ...includeWhenPresent("notes", dto.notes),
        status: dto.status,
        approvalSteps: dto.approval_steps.map((step) => ({
            stepName: step.step_name,
            status: step.status,
            ...includeWhenPresent("completedAt", step.completed_at),
            ...includeWhenPresent("actor", step.actor)
        }))
    };
}

