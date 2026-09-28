# Existing authentication refactor regression checklist

Scope: preserve the current username/password API and localStorage profile contract.
The integration playbook was consulted before auth edits. Its JWT/cookie migration,
new endpoints, indexes and admin seed changes are NOT authorized by this refactor.
No backend authentication, credentials or storage format is changed.

1. Read memory/test_credentials.md; use existing admin/admin, never change its password.
2. Correct login calls POST /api/auth/login with username/password; persisted profile
   contains no password/hash. Invalid login leaves user logged out and shows an error.
3. Reload restores the existing profile; corrupt JSON does not crash the app.
4. Logout removes the profile and returns to login. No duplicate login requests.
5. Create only temporary users for user CRUD/role/column regression; record their
   credentials in memory/test_credentials.md before use, delete them after testing.
6. Editing with blank password omits password from PUT. Explicit new password works.
7. Non-admin UI hides settings and respects columns; admin UI shows all columns.
8. Known limitation, not fixed here: API endpoints lack server-side authorization.
   Client-side visibility is NOT a security boundary; session security requires a
   separately approved backend authentication migration.