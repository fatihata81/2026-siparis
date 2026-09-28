# Code quality report audit — 2026-09-29

## Scope
User approved behavior-preserving refactor of form, orders/data/table, users,
auth UI/context, print lifecycle and toast. No backend/auth protocol migration.

## Hook report adjudication
- OrderManagement initial data effect: functions should not be omitted. Replaced
  by useOrderData/useApiResource with stable refresh callbacks and abort cleanup.
- OrderForm initial districts effect: genuinely reads omitted formData/districts.
  Replaced with useDistricts(province); changing province cancels the prior fetch.
- OrderForm edit effect: mapping moved into createOrderFormState; dependencies
  only editingOrder; state setters/imported functions are stable. Does not depend
  on formData, which would cause user edits to be overwritten.
- UserManagement fetchUsers effect: replaced with useApiResource(/users).
- setPrintJob/setUser/setLoading/setFormData: React useState setters are stable.
  Extra dependencies/ref wrapping are not necessary. Kept valid empty callback.
- OrdersTable memo callbacks: order/fullName/uniqueProvinces/uniquePayments are
  local variables, NOT dependencies. Original dependencies were complete.
  Filtering moved intact into useOrderFilters (handles missing phone/empty options).
- AuthContext mount: localStorage is a browser global, not a reactive dependency.
  Storage/API methods extracted; session hydration hook and memoized context.
- PrintJob: cancelled/started/afterPrint/prepare are effect-local; fitContent is
  module-level. Do not add out-of-scope identifiers. Extracted setup/preparation,
  preserving [job,onComplete] and stable ref dependencies, afterprint cleanup.
- use-toast: index is effect-local, listeners module-local and setter stable.
  Actual issue: [state] unnecessarily resubscribed each change. Replaced by
  useSyncExternalStore with a pure reducer and separate timer dispatch effects.

## Structure
- OrderForm: customer/address/shared first-second product/payment sections,
  field primitives, pure model/validation, useOrderFormState/useDistricts.
- Orders: useOrderData, useOrderFilters, header/filters/table header/row/actions.
- Users: useUserManagement, inline UserForm (not modal), ColumnPermissions, UserList.
- Auth: useAuthSession, auth helpers, useLoginForm/LoginForm, stable AuthContext.
- Settings: layout/header/menu separated. Printing: preparePrintDocument/usePrintLifecycle.
- Shared api/errors/resources/actions. No dependency suppression comments.
- Payment empty-initialization guard retained for all Radix form selects.
- Failed create no longer clears inputs; edit→list→new clears stale edit context.
- Actual existing security limitation remains: backend has no session enforcement.

## Verification
- Added eslint-plugin-react-hooks and ESLint9 flat config for hooks + nested ternaries.
- Build/lint and regression report pending.