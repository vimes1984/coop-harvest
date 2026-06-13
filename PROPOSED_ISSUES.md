# 📋 Growers' Collective: Mapped GitHub Issues & Feature Requests

This file contains the pre-written issues and feature requests mapping out the next steps of the project. If you are running headlessly, copy the contents below to create the issues on your GitHub repository.

---

## 1. [FEATURE] Localize payment routing using Stripe Connect
*   **Title**: `[FEATURE] Localize payment routing using Stripe Connect`
*   **Labels**: `enhancement`, `help wanted`

### Description
Implement Stripe Connect in the Express backend to support the pricing charter splits:
*   **82%** direct transfer to the farmer's bank account.
*   **13%** to the logistics cooperative wallet.
*   **5%** to system administration.

### Tasks
- [ ] Create Stripe Connect account onboarding logic in backend.
- [ ] Add payment split routing inside order controllers.
- [ ] Integrate Stripe Elements in React Checkout view.

---

## 2. [FEATURE] Offline-first synchronization for remote depot terminals
*   **Title**: `[FEATURE] Offline-first synchronization for remote depot terminals`
*   **Labels**: `enhancement`, `help wanted`

### Description
Local GAA and parish pickup depots often have spotty cellular internet. We need the tablet app (Electron/Capacitor) to support offline check-ins and order processing.

### Proposal
Use RxDB or PouchDB to store local transactions in IndexedDB and replicate changes when online.

### Tasks
- [ ] Define local client storage schema.
- [ ] Implement query queue sync hook.
- [ ] Add network connection status listener in App.tsx.

---

## 3. [TASK] Add Cypress End-to-End integration tests
*   **Title**: `[TASK] Add Cypress End-to-End integration tests`
*   **Labels**: `documentation`, `help wanted`

### Description
Ensure critical paths (browsing marketplace, placing order, checking out, and voting on proposals) are automated and verified on each build.

### Tasks
- [ ] Configure Cypress in `/frontend`.
- [ ] Write integration test cases for mock checkout flow.
- [ ] Integrate testing script in GitHub Action workflow.

---

## 4. [FEATURE] Add GAA/Parish self-hosting guides and templates
*   **Title**: `[FEATURE] Add GAA/Parish self-hosting guides and templates`
*   **Labels**: `documentation`

### Description
Create printable PDF and Markdown setup guides for regional coordinators to host physical food distribution depots at local clubs or parish halls.

### Tasks
- [ ] Create `/docs/logistics` directory in repo.
- [ ] Write volunteer coordination guide.
- [ ] Draft organic food handling and safety template.
