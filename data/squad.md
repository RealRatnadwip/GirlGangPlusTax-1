# Squad Data

## Schema Instructions

This file stores information about the GirlGangPlusTax squad members. The web application dynamically reads and parses this table at runtime to render squad cards.

### Field Definitions & Allowed States

1. **Name**: The member's full name. If the member is not confirmed, this must be set to `Yet to be announced`.
2. **Username**: The GitHub/social handle of the member (e.g. `@sayantica.exe`). If the member is not confirmed, this must be set to `Coming Soon`.
3. **Profile Link**: The URL the username should link to (e.g. `https://github.com/sayantica`). If the member is not confirmed, this must be set to `#`.
4. **Image**: The path to the member's profile image (e.g. `media/team/image/sayantica.jpg`). If the member is not confirmed or there is no image, this must be set to `#`.
5. **Role**: The technical role of the member on the team.
6. **Category**: Used for filtering the squad on the landing page. Must be one of the following:
   - `core` (Core & Lead)
   - `ai` (AI & ML)
   - `fullstack` (Fullstack & Infra)
   - `design` (Design & Pitch)
7. **Mini Badge**: A small humorous role descriptor.
8. **Gender**: The gender of the member. Allowed values:
   - `Girl`
   - `Guy (Tax)`
9. **Bio**: A short description of their responsibilities.
10. **Superpower**: Humorous team superpower.
11. **Caffeine Intake**: Typical daily caffeine consumption.
12. **Favorite Error**: Typical console/runtime error they encounter.
13. **Tags**: Comma-separated list of technology tags.
14. **Status**: The confirmation status of the member. Must be one of:
    - `Confirmed`
    - `Unconfirmed` (will render as a "Coming Soon / Yet to be announced" placeholder card)

## Squad Table

| Name | Username | Profile Link | Image | Role | Category | Mini Badge | Gender | Bio | Superpower | Caffeine Intake | Favorite Error | Tags | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ratnadwip Sarkar | @Realratandwip | https://ratandwip.com/ | member_img/ratnadwip.jpg | Team Lead & Main Architect | core | Strategic Overlord | Guy (Tax) | Orchestrating microservices, team harmony, and pitch perfection. Keeps the roadmap on track when code panic strikes. | Turning chaotic specs into clean system designs | 5x Filter Coffee / Day | `Pigeon is hungry` | Architecture, Fullstack, Pitching | Confirmed |
| Ankita Aich | @ankitaaichhh29 | https://instagram.com/ankitaaichhh29 | member_img/ankita.jpg | Backend Engineer | fullstack | On-call Engineer | Girl | Designing robust REST APIs, PostgreSQL schemas, and low-latency database queries. Handles database operations and keeps servers alive. | Writing raw SQL queries that compile faster than caching engines | Double Espresso Shot | `500 Internal Server Error` | FastAPI, PostgreSQL, Redis | Confirmed |
| Sayantica Ghosh | @0xsayantica | https://www.instagram.com/sayantica_ghosh_04/ | member_img/sayantica.jpg | Frontend Engineer | design | Pixel Perfectionist | Girl | Crafting pixel-perfect layouts, responsive interfaces, and interactive terminal scripts. Ensures the CSS behaves on all resolutions. | Squashing z-index bugs and centring div elements on the first try | Chai pe charcha 24/7 | `z-index: 999999 (Still behind sibling)` | React/ES6, CSS3, Tailwind | Confirmed |
| Souradip Ghosh | @0xSouradip | https://souradip.745482.xyz/ | member_img/souradip.jpg | QA Engineer | fullstack | Edge Tester | Guy (Tax) | Writing automated tests, finding edge-case exploits, and breaking production builds before the jury gets to see them. | Finding critical logic loopholes in compiled backend endpoints | Red Bull IV | `AssertionError: expected true to be false` | Selenium, PyTest, CI/CD | Confirmed |
| Yet to be announced | Coming Soon | # | # |  | design |  | Girl |  | Vectorizing hand-drawn layouts under tight deadlines | Iced Caramel Macchiato | `TBD` |  | Unconfirmed |
| Yet to be announced | Coming Soon | # | # |  | ai |  | Girl |  | Scraping and cleaning unformatted CSVs in minutes | Green Tea + Dark Chocolate | `NaN (Not a Number, but is a mood)` |  | Unconfirmed |
