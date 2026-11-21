import type { InterFlatIssueDto } from './interFlat.dto';
import type { InterFlatIssue } from '../../../../shared/types/interFlat.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapIssueToDomain(dto: InterFlatIssueDto): InterFlatIssue {
    return {
        id: dto.id,
        issueNumber: dto.issue_number,
        issueType: dto.issue_type,
        severity: dto.severity,
        status: dto.status,
        reporterUserId: dto.reporter_user_id,
        reporterUserName: dto.reporter_user_name,
        reporterFlat: dto.reporter_flat,
        reporterTower: dto.reporter_tower,
        involvedFlat: dto.involved_flat,
        involvedTower: dto.involved_tower,
        ...includeWhenPresent("involvedResidentName", dto.involved_resident_name),
        location: dto.location,
        description: dto.description,
        ...includeWhenPresent("preferredResolution", dto.preferred_resolution),
        evidence: dto.evidence || [],
        responses: dto.responses || [],
        ...includeWhenPresent("inspectionId", dto.inspection_id),
        ...includeWhenPresent("mediationId", dto.mediation_id),
        ruleReferenceIds: dto.rule_reference_ids || [],
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        ...includeWhenPresent("resolvedAt", dto.resolved_at),
        ...includeWhenPresent("closedAt", dto.closed_at),
        ...includeWhenPresent("closureSummary", dto.closure_summary)
    };
}
export function mapDomainToIssueDto(domain: InterFlatIssue): InterFlatIssueDto {
    return {
        id: domain.id,
        issue_number: domain.issueNumber,
        issue_type: domain.issueType,
        severity: domain.severity,
        status: domain.status,
        reporter_user_id: domain.reporterUserId,
        reporter_user_name: domain.reporterUserName,
        reporter_flat: domain.reporterFlat,
        reporter_tower: domain.reporterTower,
        involved_flat: domain.involvedFlat,
        involved_tower: domain.involvedTower,
        ...includeWhenPresent("involved_resident_name", domain.involvedResidentName),
        location: domain.location,
        description: domain.description,
        ...includeWhenPresent("preferred_resolution", domain.preferredResolution),
        evidence: domain.evidence,
        responses: domain.responses,
        ...includeWhenPresent("inspection_id", domain.inspectionId),
        ...includeWhenPresent("mediation_id", domain.mediationId),
        ...includeWhenPresent("rule_reference_ids", domain.ruleReferenceIds),
        created_at: domain.createdAt,
        updated_at: domain.updatedAt,
        ...includeWhenPresent("resolved_at", domain.resolvedAt),
        ...includeWhenPresent("closed_at", domain.closedAt),
        ...includeWhenPresent("closure_summary", domain.closureSummary)
    };
}

