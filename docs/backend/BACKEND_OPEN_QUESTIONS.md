# SocietyOS Backend Open Questions & Integration Unknowns

This document records architectural unknowns, unconfirmed protocol assumptions, and external provider decisions required prior to real backend integration.

---

## 1. Authentication & Session Management
- **Token Refresh Protocol**: Will the backend use standard OAuth2 / OIDC refresh tokens via `POST /oauth/token` (`grant_type=refresh_token`), or custom session cookies / HTTP-only refresh tokens?
- **Concurrent 401 Handling**: When an access token expires while multiple queries are in flight, what is the expected grace window before the refresh token itself is rotated?
- **Biometric Attestation**: Will biometric login require device attestation / WebAuthn passkeys or local SecureStore unlocking of an encrypted refresh secret?

---

## 2. Payment Gateway Integration
- **Payment Provider**: Which payment gateway provider will be integrated (e.g. Razorpay, Stripe, Cashfree, UPI Intent)?
- **Webhook vs. Client Confirmation**: Is client-side receipt generation purely informative pending webhook reconciliation, or does the payment endpoint return final settled state synchronously?
- **Refund Workflows**: When a paid facility reservation with an advance deposit is cancelled, does the backend execute automatic payment reversal or credit society advance balances?

---

## 3. Real-Time Updates & Push Delivery
- **Transport Mechanism**: Will real-time events (Gate entry notifications, SOS alerts, Chat updates) be streamed via WebSockets, Server-Sent Events (SSE), or MQTT?
- **Push Notification Service**: Which push delivery service will be authoritative (Expo Push API, Firebase Cloud Messaging (FCM), Apple Push Notification service (APNs))?
- **Delivery Guarantees**: Does the backend support message delivery receipts / acknowledgment frames for safety-critical alerts (Emergency SOS)?

---

## 4. Binary File & Document Storage
- **File Upload Protocol**: Will document and complaint media uploads use direct multipart POST to the API server, or pre-signed AWS S3 / Google Cloud Storage URLs?
- **Image Transcoding**: Does the backend accept full-resolution camera captures and optimize server-side, or must the mobile client resize images before transmission?
- **Signed URL Expiration**: What is the TTL for pre-signed private document viewing URLs (recommended: 15 minutes)?

---

## 5. Audit & Compliance
- **Audit Log Retention**: What is the statutory retention duration for visitor gate logs and emergency SOS dispatch recordings (e.g., 90 days vs. 1 year)?
- **Cross-Society Data Residency**: Are multi-society instances tenant-isolated by database schema or logical row-level security (`society_id`)?
