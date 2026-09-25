# InfoSec Streams

Congrats! You've found an actively maintained list of Information Security-related Twitch streams. This list is `sorted` based on `30-day activity` to help you find active streams more easily!

Streamers that haven't had activity in the last month are moved to the [inactive streamers](/inactive) page.

Questions? Contributions? Something else? Please read the [FAQ](/faq)!

## Top 10 Streamers Leaderboard

<div class="leaderboard-container" style="position: relative; height:400px; width:100%; margin-bottom: 20px;">
  <canvas id="activityChart"></canvas>
</div>

<style>
  .switch { position: relative; display: inline-block; width: 40px; height: 22px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .2s; border-radius: 34px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .2s; border-radius: 50%; }
  input:checked + .slider { background-color: #9146FF; }
  input:focus + .slider { box-shadow: 0 0 1px #9146FF; }
  input:checked + .slider:before { transform: translateX(18px); }
</style>

<div class="controls-bar" style="margin-bottom: 20px; display: flex; gap: 15px; align-items: center;">
  <div style="display: flex; align-items: center; gap: 10px;">
    <label class="switch">
      <input type="checkbox" id="toggle-offline">
      <span class="slider"></span>
    </label>
    <label for="toggle-offline" style="cursor: pointer; font-weight: bold; margin: 0;">Show Offline Streamers</label>
  </div>
</div>

<div class="table-responsive">
  <table id="streamers-table" class="streamer-table">
    <thead>
      <tr>
        <th style="width: 50px;">Status</th>
        <th>Streamer</th>
        <th>Category / Game</th>
        <th>Tags</th>
        <th>Links</th>
      </tr>
    </thead>
    <tbody id="streamers-tbody">
      <tr><td colspan="5" style="text-align:center;">Loading streamers from API...</td></tr>
    </tbody>
  </table>
</div>
<div id="pagination-controls" style="margin-top: 15px; display: flex; justify-content: center; gap: 10px; align-items: center;"></div>

### Credits

**Note: Fork by [infosecstreams-mirror UK team](https://github.com/infosecstreams-mirror)**  
**Maintained by [Wupinyin](https://github.com/DiscoMouse)**

*Looking for the original Infosecstreams? [click here](https://infosecstreams.com)*

We maintain our own custom feature set (like the Top 10 Leaderboard) and aim to provide a frictionless onboarding experience. We regularly sync with the upstream project but manage our own list of streamers directly. **Please ensure any bug reports or issues are opened on *our* repository**, not the upstream one.

*Original Upstream Credits:*
This project was originally built as a community effort. [DiscoMouse](https://twitch.tv/DiscoMouse) maintains the upstream golang code in [secinfo](https://github.com/infosecstreams-mirror/secinfo), [streamstatus](https://github.com/infosecstreams-mirror/streamstatus), and the original upstream repository.

Shoutout to [chadb_n00b](https://twitch.tv/chadb_n00b) for starting up and maintaining the original [hacklist](https://docs.google.com/spreadsheets/d/e/2PACX-1vR_YY0A7i8-E0mRXJmCZTxARcZPm77dAV7funlMadAK2SliG0sWfdRUMlQ3DQux7WfqKD_JuVa-1I73/pubhtml)!

### Resources

Here are [some great resources](/resources) for your hacking journey.

### Contribute or Report an Issue

Having trouble with a link? Site not updating properly? Questions? Contributions? Something else? Please read the [FAQ](/faq)!

<script src="/js/sort.js" async="" defer=""></script>
<script src="/js/vendor/fontawesome.all.min.js"></script>
<script src="/js/vendor/chart.umd.js"></script>
<script src="/js/chart.js" async="" defer=""></script>
