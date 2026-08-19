import { buildAuditEvent } from "../auditEventBuilder";

describe("audit event builder", () => {
  it("builds audit events with mock context and sanitized metadata", () => {
    const event = buildAuditEvent({
      eventType: "DOCUMENT_VIEW_ATTEMPT",
      entityType: "document",
      entityId: "doc-001",
      metadata: {
        source: "document-detail",
        mobileNumber: "7276834907",
      },
    });

    expect(event.actorRole).toBe("RESIDENT_OWNER");
    expect(event.societyId).toBe("society-001");
    expect(event.metadata).toEqual({ source: "document-detail" });
  });
});
