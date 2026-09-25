# Fork Changelog

This document tracks how our fork differs from the upstream `infosecstreams` repository.

## Added
* **Top 10 Streamer Leaderboard**: Added a `Chart.js` bar chart at the top of the streams list (`js/chart.js` and modified templates) to visualize the activity scores of the top 10 streamers.
* **Persisted `active.json`**: Modified the `.github/workflows/main.yaml` action to correctly capture and commit `active.json` from the `secinfo` Docker container so that the frontend leaderboard graph can consume the data.

## Removed
* **Upstream Analytics**: Removed the Plausible Analytics tracker (`p.infosecstreams.com`) from all markdown templates (`index.tmpl.md`, `inactive.tmpl.md`, `faq.md`, etc.) and their translated counterparts to ensure our fork no longer pings the upstream maintainers' server.
