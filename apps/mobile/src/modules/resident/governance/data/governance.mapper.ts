import type { Meeting, MeetingNotice, AgendaItem, MeetingMinutes, ProxyDelegation, MeetingQuestion, AttendanceRecord } from '../../../../shared/types/meeting.types';
import type { Resolution } from '../../../../shared/types/resolution.types';
import type { Poll, PollResults } from '../../../../shared/types/poll.types';
import type { Election, ElectionCandidate } from '../../../../shared/types/election.types';
import type { ComplianceItem, LegalNotice, BylawDocument, MemberRecord, AuditLogEntry } from '../../../../shared/types/complianceCalendar.types';
import type {
  MeetingDto, MeetingNoticeDto, AgendaItemDto, MeetingMinutesDto, ProxyDelegationDto, MeetingQuestionDto, AttendanceRecordDto,
  ResolutionDto, PollDto, PollResultsDto, ElectionDto, ElectionCandidateDto,
  ComplianceItemDto, LegalNoticeDto, BylawDocumentDto, MemberRecordDto, AuditLogEntryDto
} from './governance.dto';

export const mapMeetingToDomain = (dto: MeetingDto): Meeting => ({ ...dto });
export const mapNoticeToDomain = (dto: MeetingNoticeDto): MeetingNotice => ({ ...dto });
export const mapAgendaToDomain = (dto: AgendaItemDto): AgendaItem => ({ ...dto });
export const mapMinutesToDomain = (dto: MeetingMinutesDto): MeetingMinutes => ({ ...dto });
export const mapProxyToDomain = (dto: ProxyDelegationDto): ProxyDelegation => ({ ...dto });
export const mapQuestionToDomain = (dto: MeetingQuestionDto): MeetingQuestion => ({ ...dto });
export const mapAttendanceToDomain = (dto: AttendanceRecordDto): AttendanceRecord => ({ ...dto });

export const mapResolutionToDomain = (dto: ResolutionDto): Resolution => ({ ...dto });

export const mapPollToDomain = (dto: PollDto): Poll => ({ ...dto });
export const mapPollResultsToDomain = (dto: PollResultsDto): PollResults => ({ ...dto });

export const mapElectionToDomain = (dto: ElectionDto): Election => ({ ...dto });
export const mapCandidateToDomain = (dto: ElectionCandidateDto): ElectionCandidate => ({ ...dto });

export const mapComplianceToDomain = (dto: ComplianceItemDto): ComplianceItem => ({ ...dto });
export const mapLegalNoticeToDomain = (dto: LegalNoticeDto): LegalNotice => ({ ...dto });
export const mapBylawToDomain = (dto: BylawDocumentDto): BylawDocument => ({ ...dto });
export const mapMemberToDomain = (dto: MemberRecordDto): MemberRecord => ({ ...dto });
export const mapAuditLogToDomain = (dto: AuditLogEntryDto): AuditLogEntry => ({ ...dto });
