# Infosec Streams List (UK Mirror)

> **Notice regarding Apache 2.0 Compliance**: This repository is a modified fork of the original [infosecstreams/infosecstreams-mirror.github.io](https://github.com/infosecstreams-mirror/infosecstreams-mirror.github.io). 
> 
> Notable changes include:
> - Addition of a Top 10 Streamer Leaderboard via Chart.js
> - Modified GitHub Actions to persist analytics data 
> - Full localization of third-party NPM dependencies
> 
> See `CHANGELOG.md` for a full list of modifications. Original copyright and the Apache 2.0 license remain intact and apply to the upstream source.

### How it works

This frontend completely decouples the UI from the backend data generation. It fetches live data from the **StreamStatus API**. By default, it connects to the community API at `https://streamstatus.wupinyin.co.uk`.

### Host Your Own!

Because this repository is a **GitHub Template**, you can instantly spin up your own customized version of the site!
1. Click the green **"Use this template"** button at the top of the repository to create your own fork.
2. Enable **GitHub Pages** in your repository settings (Settings -> Pages -> Deploy from a branch -> `main`).
3. If you decide to host your own backend database API, simply edit `js/sort.js` and change the `API_ENDPOINT` constant at the top of the file to point to your new URL!
4. (Optional) If you have a custom domain, configure it in your GitHub Pages settings, which will automatically generate a `CNAME` file in your repository.

### Contributing / Updating

To add yourself to the community list, use our new dynamic API integration. We are working on a more frictionless onboarding process and will update this section once the process is finalized.

[![Star History Chart](https://api.star-history.com/svg?repos=infosecstreams/infosecstreams-mirror.github.io,infosecstreams-mirror/infosecstreams-mirror.github.io&type=Date)](https://star-history.com/#infosecstreams/infosecstreams-mirror.github.io&infosecstreams-mirror/infosecstreams-mirror.github.io&Date)
