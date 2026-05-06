
# Security Specification for BioMed Connect

## Data Invariants
- A `Panne` must be reported by an authenticated user.
- A user can only modify their own profile (except for admins).
- Only technicians and admins can update `Panne` status or assign themselves.
- `reportedBy` field in `Panne` must match the authenticated user's UID on creation.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a `Panne` with a different `reportedBy` UID.
2. **Privilege Escalation**: A nurse attempting to update their role to `admin` in `users` collection.
3. **Ghost Field Injection**: Adding `isVerified: true` to a `Panne` document.
4. **Foreign State Update**: A nurse trying to mark a `Panne` as `Résolue`.
5. **Orphaned Write**: Creating a `Panne` for a non-existent equipment ID.
6. **Malicious ID**: Creating a document with a 1MB string as ID.
7. **Bypassing AI**: Submitting a `Panne` with a manual `priorityScore` of 20 without going through the form.
8. **PII Leak**: A technician trying to read all `users` profiles including private emails if they were isolated.
9. ... (and so on)

## Rules Implementation Strategy
- Use `isValidUser`, `isValidPanne` helpers.
- Enforce role-based access using `get()` on the `users` collection.
- Strict key validation using `affectedKeys().hasOnly()`.
