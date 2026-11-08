import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type {
  ConfirmVisitorLeftInput,
  ConfirmVisitorStillInsideInput,
  ContactSecurityForVisitorExitInput,
  CreateVisitorPayload,
  ExtendVisitorExpectedExitInput,
  Visitor,
  VisitorExitEscalationResult,
  VisitorExitAlert,
  VisitorStatus,
  CancelVisitorPassRequest,
  CancelVisitorPassResult,
} from '../../../../shared/types/visitor.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from '../../../../shared/types/absence.types';

export interface ResidentVisitorsRepository {
  list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Visitor[]>>;
  detail(
    context: ResidentRepositoryRequestContext | string,
    visitorPassId?: string
  ): Promise<RepositoryResult<Visitor | Absent>>;
  create(
    context: ResidentRepositoryRequestContext | CreateVisitorPayload,
    payload?: CreateVisitorPayload
  ): Promise<RepositoryResult<Visitor>>;
  cancelVisitorPass(input: CancelVisitorPassRequest): Promise<RepositoryResult<CancelVisitorPassResult>>;
  confirmVisitorLeft(input: ConfirmVisitorLeftInput): Promise<RepositoryResult<Visitor>>;
  confirmVisitorStillInside(input: ConfirmVisitorStillInsideInput): Promise<RepositoryResult<Visitor>>;
  extendVisitorExpectedExit(input: ExtendVisitorExpectedExitInput): Promise<RepositoryResult<Visitor>>;
  contactSecurityForVisitorExit(
    input: ContactSecurityForVisitorExitInput
  ): Promise<RepositoryResult<VisitorExitEscalationResult>>;
  updateStatus(
    context: ResidentRepositoryRequestContext | string,
    idOrStatus?: string,
    status?: VisitorStatus | string
  ): Promise<RepositoryResult<Visitor>>;
  getVisitorExitAlerts(
    context?: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<VisitorExitAlert[]>>;
}
