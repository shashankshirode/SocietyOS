

export interface TreasurerDashboardDTO {
  total_billed_this_month: number;
  total_collected_this_month: number;
  outstanding_dues: number;
  collection_efficiency: number;
  defaulter_count: number;
  pending_manual_entries: number;
  failed_payments: number;
  reconciliation_pending: number;
  adjustments_this_month: number;
  advance_excess_payments: number;
  last_updated_at: string;
}

export interface ChargeHeadDTO {
  id: string;
  name: string;
  type: string;
  calculation_method: string;
  default_amount?: number;
  default_rate?: number;
  tax_applicable: boolean;
  is_active: boolean;
  used_in_billing_cycle: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingCycleDTO {
  id: string;
  cycle_name: string;
  month: string;
  year: number;
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
  status: string;
  applicable_towers: string[];
  total_units: number;
  draft_bills_count: number;
  published_bills_count: number;
  total_amount: number;
  collected_amount: number;
  outstanding_amount: number;
  charge_head_ids: string[];
  include_penalties: boolean;
  include_previous_dues: boolean;
  notes?: string;
  created_by: string;
  created_at: string;
  calculated_at?: string;
  published_at?: string;
}

export interface DraftBillDTO {
  id: string;
  billing_cycle_id: string;
  unit_id: string;
  unit_number: string;
  wing: string;
  owner_name: string;
  tenant_name?: string;
  previous_due: number;
  current_charges: number;
  penalty: number;
  adjustments: number;
  total_payable: number;
  status: string;
  has_warning: boolean;
  warning_message?: string;
  charge_breakup: { charge_head: string; amount: number }[];
}

export interface ManualPaymentDTO {
  id: string;
  payment_number: string;
  unit_id: string;
  unit_number: string;
  wing: string;
  resident_name: string;
  amount: number;
  payment_mode: string;
  payment_date: string;
  reference_number: string;
  bank_name?: string;
  cheque_number?: string;
  notes?: string;
  received_by: string;
  status: string;
  receipt_id?: string;
  receipt_number?: string;
  created_at: string;
  requires_approval: boolean;
}

export interface DefaulterDTO {
  unit_id: string;
  unit_number: string;
  wing: string;
  resident_display_name: string;
  outstanding_amount: number;
  ageing_bucket: string;
  last_payment_date?: string;
  reminder_count: number;
  notices_sent: number;
  is_disputed: boolean;
  dispute_reason?: string;
  oldest_due_month: string;
}

export interface BankTransactionDTO {
  id: string;
  transaction_date: string;
  bank_reference: string;
  amount: number;
  probable_unit_number?: string;
  probable_unit_id?: string;
  suggested_payment_id?: string;
  match_confidence?: number;
  status: string;
  matched_by?: string;
  matched_at?: string;
  rejection_reason?: string;
  bank_name: string;
  narration?: string;
}


export interface GenerateBillsInputDTO {
  billing_cycle_month: string;
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
  applicable_towers: string[];
  charge_head_ids: string[];
  include_parking_charges: boolean;
  include_penalties: boolean;
  include_previous_dues: boolean;
  notes?: string;
}

export interface ManualPaymentInputDTO {
  unit_id: string;
  amount: number;
  payment_mode: string;
  payment_date: string;
  reference_number: string;
  bank_name?: string;
  cheque_number?: string;
  notes?: string;
}
