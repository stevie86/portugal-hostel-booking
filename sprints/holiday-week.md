Goal (by Friday): Ship a clickable MVP preview that a hostel owner can try:

Admin can create and list rooms (name, beds, bathroom).

Public page lists rooms with a simple availability bar.

Vercel Preview URL is shareable and stable.



---

Scope (this sprint only)

Admin room form + list (CRUD locally).

Public rooms listing with bathroom badge and mock availability.

Preview deploy (read-only demo mode if DB writes are blocked).

Link audit (no dead anchors).


Out of scope: payments, CMS, auth flows (beyond temporary guard), multi-property UX polish, heavy testing, complex CI.


---

Tasks (execute in order)

1) Branch & Environment

[ ] Create branch sprint-1-mvp (or continue mvp-polish) from latest main

[ ] Confirm npm-only toolchain (npm ci, npm run build)

[ ] Ensure Preview env has DEMO_READONLY=true


2) Data Layer (Prisma + SQLite, additive-only)

[ ] Verify models exist: Property, Room, Booking (no destructive changes)

[ ] Seed one default property “Lisbon Starter Hostel” and two rooms (dorm, private)

[ ] npx prisma generate runs cleanly


3) Admin Experience

[ ] Admin page with room form: name (2–60), bedsTotal (1–24), hasBathroom (boolean)

[ ] If exactly one property exists, do not render a property dropdown; display label instead

[ ] List existing rooms under the form

[ ] Implement delete for rooms (confirm prompt)

[ ] Minimal clean styling (Tailwind)


4) Public Experience

[ ] /rooms page lists rooms for default property (support ?propertyId= later)

[ ] Each card shows: name, beds, Private/Shared bathroom badge

[ ] Simple 7-day mock availability bar (40–60% booked) with “X free” label


5) Preview Behavior & Guard

[ ] On Preview, short-circuit writes (demo mode) and show a small notice: “Demo mode: changes aren’t persisted”

[ ] Locally, writes persist to SQLite as normal


6) Link Audit

[ ] Ensure all <a> have valid targets; if target not ready → use href="#", aria-disabled="true", and preventDefault

[ ] Convert action-only anchors to <button>

[ ] External links: target="_blank" rel="noopener noreferrer"


7) Deploy & Share

[ ] npm run build green locally and in CI

[ ] Deploy Vercel Preview for this branch

[ ] Capture preview URL and add to README


8) Quick Docs

[ ] Update README.md with: how to add a room (Admin), where to see rooms (Public), and demo-mode note

[ ] Append one paragraph “Next Steps” (auth, multi-property, polish)



---

Definition of Done (evidence required)

[ ] Commit hash for each task group

[ ] CI build green

[ ] Vercel Preview URL that loads /admin and /rooms

[ ] README updated with preview link and usage notes