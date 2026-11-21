import type { Absent } from "../types/absence.types";
function digitsOnly(value: string): string {
    return value.replace(/\D/g, '');
}
function safeValue(value: string | Absent | null): string {
    return typeof value === 'string' ? value.trim() : '';
}
export function maskMobileNumber(value: string): string {
    const digits = digitsOnly(safeValue(value));
    if (digits.length <= 4) {
        return digits ? `******${digits}` : '';
    }
    return `******${digits.slice(-4)}`;
}
export function maskEmail(value: string): string {
    const email = safeValue(value);
    const [local, domain] = email.split('@');
    if (!local || !domain) {
        return email ? '****' : '';
    }
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}${'*'.repeat(Math.max(4, local.length - visible.length))}@${domain}`;
}
export function maskAadhaar(value: string): string {
    const digits = digitsOnly(safeValue(value));
    return digits ? `XXXX XXXX ${digits.slice(-4)}` : '';
}
export function maskPan(value: string): string {
    const pan = safeValue(value).toUpperCase().replace(/\s/g, '');
    if (pan.length <= 5) {
        return pan ? '*****' : '';
    }
    return `${pan.slice(0, 4)}*****${pan.slice(-1)}`;
}
export function maskGst(value: string): string {
    const gst = safeValue(value).toUpperCase().replace(/\s/g, '');
    if (gst.length <= 7) {
        return gst ? '****' : '';
    }
    return `${gst.slice(0, 7)}****${gst.slice(-3)}`;
}
export function maskVehicleNumber(value: string, mode: 'partial' | 'visible' = 'partial'): string {
    const vehicle = safeValue(value).toUpperCase();
    if (mode === 'visible') {
        return vehicle;
    }
    const compact = vehicle.replace(/\s|-/g, '');
    return compact.length > 4 ? `${compact.slice(0, 4)}****${compact.slice(-2)}` : compact;
}
export function maskRfid(value: string): string {
    const cleaned = safeValue(value).toUpperCase();
    if (!cleaned) {
        return '';
    }
    return `RFID-****-${cleaned.slice(-4)}`;
}
export function maskDocumentNumber(value: string): string {
    const cleaned = safeValue(value).toUpperCase();
    return cleaned.length > 4 ? `DOC-****-${cleaned.slice(-4)}` : cleaned;
}
export function maskBankAccount(value: string): string {
    const digits = digitsOnly(safeValue(value));
    return digits ? `XXXXXX${digits.slice(-4)}` : '';
}

