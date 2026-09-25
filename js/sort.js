'use strict';

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------
// Change this URL if you are hosting your own StreamStatus backend!
// By default, this connects to the public read-only API provided by the community.
const API_ENDPOINT = 'https://streamstatus.wupinyin.co.uk/api/streamers';
// ----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('streamers-tbody');
  const toggleOffline = document.getElementById('toggle-offline');
  const paginationControls = document.getElementById('pagination-controls');
  let allStreamers = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  // Function to render the table rows based on the filter
  const renderTable = () => {
    tbody.innerHTML = '';
    if (paginationControls) paginationControls.innerHTML = '';
    const showOffline = toggleOffline.checked;
    
    // Sort streamers: online first, then alphabetical
    const sortedStreamers = [...allStreamers].sort((a, b) => {
      if (a.is_online && !b.is_online) return -1;
      if (!a.is_online && b.is_online) return 1;
      return a.username.toLowerCase().localeCompare(b.username.toLowerCase());
    });

    // Filter streamers
    const displayStreamers = sortedStreamers.filter(streamer => {
      if (!streamer.is_online && !showOffline) return false;
      return true;
    });

    if (displayStreamers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No streamers to display.</td></tr>';
      return;
    }

    // Pagination math
    const totalPages = Math.ceil(displayStreamers.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageStreamers = displayStreamers.slice(startIndex, startIndex + itemsPerPage);

    pageStreamers.forEach(streamer => {
      const tr = document.createElement('tr');
      
      // Status Column
      const tdStatus = document.createElement('td');
      tdStatus.style.textAlign = 'center';
      tdStatus.innerHTML = streamer.is_online 
        ? '<span title="Online">🟢</span>' 
        : '<span title="Offline" style="opacity:0.3">⚪</span>';
      
      // Streamer Name Column
      const tdName = document.createElement('td');
      tdName.innerHTML = `<strong>${streamer.username}</strong>`;

      // Game / Category Column
      const tdGame = document.createElement('td');
      tdGame.innerText = streamer.game || (streamer.is_online ? 'No Category' : '-');

      // Tags Column
      const tdTags = document.createElement('td');
      tdTags.innerText = (streamer.tags && streamer.tags.length > 0) ? streamer.tags.join(', ') : '-';

      // Links Column
      const tdLinks = document.createElement('td');
      const twitchLink = document.createElement('a');
      twitchLink.href = `https://www.twitch.tv/${streamer.username}`;
      twitchLink.target = "_blank";
      twitchLink.innerHTML = '<i class="fab fa-twitch" style="color:#9146FF; font-size:1.2em;"></i>';
      tdLinks.appendChild(twitchLink);

      tr.appendChild(tdStatus);
      tr.appendChild(tdName);
      tr.appendChild(tdGame);
      tr.appendChild(tdTags);
      tr.appendChild(tdLinks);
      
      tbody.appendChild(tr);
    });

    // Render pagination controls
    if (paginationControls && totalPages > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.innerText = 'Previous';
      prevBtn.disabled = currentPage === 1;
      prevBtn.onclick = () => {
        currentPage--;
        renderTable();
      };

      const pageInfo = document.createElement('span');
      pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

      const nextBtn = document.createElement('button');
      nextBtn.innerText = 'Next';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.onclick = () => {
        currentPage++;
        renderTable();
      };

      paginationControls.appendChild(prevBtn);
      paginationControls.appendChild(pageInfo);
      paginationControls.appendChild(nextBtn);
    }
  };

  // Event listener for the checkbox
  toggleOffline.addEventListener('change', () => {
    currentPage = 1; // reset to first page when toggling
    renderTable();
  });

  // Fetch the data from the REST API
  fetch(API_ENDPOINT)
    .then(response => response.json())
    .then(streamers => {
      allStreamers = streamers;
      renderTable(); // Render initially (defaults to offline hidden)
    })
    .catch(err => {
      console.error('Failed to load streamers from API:', err);
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data from API. Please try again later.</td></tr>';
    });
});
