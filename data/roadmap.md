# Roadmap Data

## Schema Instructions

This file stores the milestone roadmap details for the GirlGangPlusTax team. The web application dynamically reads and parses this table at runtime to build the timeline layout.

### Field Definitions & Allowed States

1. **Step**: The order/number of the step (e.g. `01`, `02`, `03`).
2. **Title**: Name of the milestone.
3. **Description**: Summary of the achievements or tasks in this phase.
4. **Status**: The current state of this milestone. Allowed values:
   - `Completed` (renders as a completed step)
   - `In Progress` (renders as the active step with a pulse effect)
   - `Upcoming` (renders as a future upcoming step)
5. **Phase**: The label or timeframe for this milestone (e.g. `Sprint Phase Alpha`).

## Roadmap Table

| Step | Title | Description | Status | Phase |
| --- | --- | --- | --- | --- |
| 01 | Problem Selection & Deep Research | Dissected SIH problem statements, analyzed existing government benchmarks, and formulated our unique architecture. | In Progress | Sprint Phase Alpha |
| 02 | Internal Hackathon Qualifier | Pitched working prototype with live ML inference and offline synchronization. Selected as top institutional team. | Upcoming | Sprint Phase Beta |
| 03 | Grand Finale Architecture Hardening | Edge deployment optimization, UI polish, microservice stress-testing, and failover redundancy implementation. | Upcoming | SIH Grand Sprint |
| 04 | Grand Finale 36-Hour Hackathon | Live judging rounds, continuous code sprints, jury demos, and bringing home the national title! | Upcoming | Grand Finale Day |
