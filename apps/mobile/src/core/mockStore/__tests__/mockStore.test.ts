import { mockStore } from "../mockStore";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
describe("Unified Mock Store Engine", () => {
    beforeEach(() => {
        mockStore.reset();
    });
    test("should initialize with correct default state", () => {
        const state = mockStore.getState();
        expect(state.visitors).toBeDefined();
        expect(state.complaints).toBeDefined();
        expect(state.notices).toBeDefined();
        expect(state.bills).toBeDefined();
        expect(state.documents).toBeDefined();
        expect(state.chatThreads).toBeDefined();
    });
    test("should support recording new visitor entries", () => {
        const initialCount = mockStore.getState().visitors.length;
        mockStore.addVisitor({
            id: "vis-new-99",
            name: "John Doe",
            type: "GUEST",
            status: "EXPECTED",
            phone: "7276834907",
            expectedDate: "2026-07-05",
            expectedTime: "18:00",
        });
        const state = mockStore.getState();
        expect(state.visitors.length).toBe(initialCount + 1);
        expect(getRequiredItem(state.visitors, 0, "mockStore.test.ts").name).toBe("John Doe");
    });
    test("should support visitor status transitions", () => {
        const visitorId = "vis-transition-99";
        mockStore.addVisitor({
            id: visitorId,
            name: "Jane Doe",
            type: "GUEST",
            status: "EXPECTED",
            phone: "7276834907",
            expectedDate: "2026-07-05",
            expectedTime: "18:00",
        });
        mockStore.updateVisitor(visitorId, { status: "APPROVED" });
        expect(mockStore.getState().visitors.find((v) => v.id === visitorId)?.status).toBe("APPROVED");
        mockStore.updateVisitor(visitorId, { status: "REJECTED" });
        expect(mockStore.getState().visitors.find((v) => v.id === visitorId)?.status).toBe("REJECTED");
    });
    test("should support adding and resolving complaints", () => {
        mockStore.addComplaint({
            id: "comp-100",
            title: "Water Seepage in Kitchen",
            description: "Dampness on ceiling",
            category: "Plumbing",
            priority: "HIGH",
            status: "OPEN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            raisedBy: "A-1204",
        });
        const created = mockStore
            .getState()
            .complaints.find((c) => c.id === "comp-100");
        expect(created).toBeDefined();
        expect(created?.status).toBe("OPEN");
        mockStore.updateComplaint("comp-100", {
            status: "RESOLVED",
            resolvedAt: new Date().toISOString(),
            technicianName: "Ramesh Kumar",
            technicianContact: "9988776655",
            resolutionNotes: "Fixed pipe joint leakage.",
            feedbackRating: 5,
            feedbackComment: "Excellent swift response!",
        });
        const updated = mockStore
            .getState()
            .complaints.find((c) => c.id === "comp-100");
        expect(updated?.status).toBe("RESOLVED");
        expect(updated?.technicianName).toBe("Ramesh Kumar");
        expect(updated?.feedbackRating).toBe(5);
    });
    test("should support publishing and acknowledging notices", () => {
        mockStore.addNotice({
            id: "not-100",
            title: "Power Shutdown Notice",
            body: "Scheduled maintenance from 10 AM to 2 PM.",
            category: "MAINTENANCE",
            priority: "URGENT",
            date: "2026-07-05",
            postedBy: "Admin Desk",
            acknowledgementRequired: true,
            acknowledgedResidents: [],
        });
        expect(mockStore.getState().notices.find((n) => n.id === "not-100")).toBeDefined();
        mockStore.updateNotice("not-100", {
            acknowledged: true,
            status: "READ",
        });
        const notice = mockStore.getState().notices.find((n) => n.id === "not-100");
        expect(notice?.status).toBe("READ");
        expect(notice?.acknowledged).toBe(true);
    });
    test("should support payment receipt generation and ledger credit entries", () => {
        const billId = "bill-test-100";
        mockStore.addBill({
            id: billId,
            billNumber: "BILL-100",
            societyName: "Green Valley Heights",
            flatNumber: "A-1204",
            title: "Maintenance July 2026",
            amount: 4500,
            dueDate: "2026-07-20",
            status: "DUE",
            charges: [],
            billingPeriod: "July 2026",
        });
        mockStore.updateBill(billId, {
            status: "PAID",
            paidDate: "2026-07-05",
            transactionId: "TXN_UPI_9988",
            receiptNumber: "RCPT_9988",
        });
        const bill = mockStore.getState().bills.find((b) => b.id === billId);
        expect(bill?.status).toBe("PAID");
        expect(bill?.receiptNumber).toBe("RCPT_9988");
        mockStore.addLedgerEntry({
            id: "led-credit-1",
            unitId: "unit-a-1204",
            amount: bill?.amount || 0,
            type: "CREDIT",
            description: `UPI Payment for ${bill?.billMonth || "Maintenance"} bill`,
            date: "2026-07-05",
        });
        const ledger = mockStore.getState().ledgerEntries;
        expect(ledger).toContainEqual(expect.objectContaining({
            id: "led-credit-1",
            type: "CREDIT",
        }));
    });
});

