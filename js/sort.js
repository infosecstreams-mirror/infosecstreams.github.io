'use strict';
const table = document.querySelector('table'); // markdown doesn't add ids but we know we want the first table
table.classList.add('streamer-table');


/******************************************************************************
 **** Sorting
 *****************************************************************************/

// Get the initialOrder of rows in table, we can trust this is 2-week activity sorted as it is set by a bot
const initialOrder = Array.from(table.rows);
let currentSort = 'initial';

function restoreInitialSort() {
  initialOrder.forEach(e => e.parentNode.appendChild(e));
  currentSort = 'initial';
}

function toggleOnlineSort(headerElement) {
  document.querySelectorAll('th[data-sort]').forEach(e => e.removeAttribute('data-sort'));
  switch (currentSort) {
    default:
    case 'initial':
      Array.from(table.rows)
        .map(r => [r, r.querySelector('td:nth-child(1)')?.innerText])
        .filter(r => r[1] !== undefined)
        .sort((a, b) => {
          if (a[1].includes('🟢') && !b[1].includes('🟢')) {
            return -1;
          } else if (b[1].includes('🟢') && !a[1].includes('🟢')) {
            return 1;
          }

          const aPos = initialOrder.indexOf(a[0]);
          const bPos = initialOrder.indexOf(b[0]);

          return aPos - bPos;
        })
        .forEach(r => r[0].parentNode.appendChild(r[0]));
      currentSort = 'online';
      headerElement.setAttribute('data-sort', 'forward');
      break;
    case 'online':
      Array.from(table.rows)
        .map(r => [r, r.querySelector('td:nth-child(1)')?.innerText])
        .filter(r => r[1] !== undefined)
        .sort((a, b) => {
          if (a[1].includes('🟢') && !b[1].includes('🟢')) {
            return 1;
          } else if (b[1].includes('🟢') && !a[1].includes('🟢')) {
            return -1;
          }

          const aPos = initialOrder.indexOf(a[0]);
          const bPos = initialOrder.indexOf(b[0]);

          return aPos - bPos;
        })
        .forEach(r => r[0].parentNode.appendChild(r[0]));
      currentSort = 'offline';
      headerElement.setAttribute('data-sort', 'backward');
      break;
    case 'offline':
      restoreInitialSort();
      headerElement.removeAttribute('data-sort');
      break;
  }
}

// Online/Offline sort
const onlineHeader = table.querySelector('th:nth-child(1)');
onlineHeader.addEventListener('click', function (e) {
  toggleOnlineSort(e.target);
});
onlineHeader.setAttribute('title', 'Sort by online status');
onlineHeader.setAttribute('role', 'button');

// Name sort
const nameHeader = table.querySelector('th:nth-child(2)');
nameHeader.addEventListener('click', function (e) {
  document.querySelectorAll('th[data-sort]').forEach(e => e.removeAttribute('data-sort'));
  switch (currentSort) {
    default:
    case 'initial':
      Array.from(table.rows)
        .map(r => [r, r.querySelector('td:nth-child(2)')?.innerText?.toLowerCase()])
        .filter(r => r[1] !== undefined)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .forEach(r => r[0].parentNode.appendChild(r[0]));
      currentSort = 'nameForward';
      e.target.setAttribute('data-sort', 'forward');
      break;
    case 'nameForward':
      Array.from(table.rows)
        .map(r => [r, r.querySelector('td:nth-child(2)')?.innerText?.toLowerCase()])
        .filter(r => r[1] !== undefined)
        .sort((a, b) => b[1].localeCompare(a[1]))
        .forEach(r => r[0].parentNode.appendChild(r[0]));
      currentSort = 'nameBackward';
      e.target.setAttribute('data-sort', 'backward');
      break;
    case 'nameBackward':
      restoreInitialSort();
      e.target.removeAttribute('data-sort');
      break;
  }
});
nameHeader.setAttribute('title', 'Sort by streamer name');
nameHeader.setAttribute('role', 'button');

// Asynchronously fetch live status payload from the new REST API
fetch('https://streamstatus.wupinyin.co.uk/api/streamers')
  .then(response => response.json())
  .then(streamers => {
    // Convert the array of streamers into a lowercase keyed map for fast DOM lookup
    const normalizedStatus = {};
    for (const streamer of streamers) {
      normalizedStatus[streamer.username.toLowerCase()] = {
        online: streamer.is_online,
        game: streamer.game,
        language: streamer.language,
        tags: streamer.tags
      };
    }

    // Hydrate the DOM
    Array.from(table.rows).forEach(row => {
      const nameCell = row.querySelector('td:nth-child(2)');
      if (!nameCell) return;
      
      const streamerName = nameCell.innerText.trim().toLowerCase();
      const statusCell = row.querySelector('td:nth-child(1)');
      const status = normalizedStatus[streamerName];

      if (status && status.online) {
        statusCell.innerHTML = '🟢';
        
        // Optionally inject game/tags into the link title
        const linkCell = row.querySelector('td:nth-child(3) a');
        if (linkCell) {
          const tags = status.tags ? status.tags.join(', ') : '';
          linkCell.setAttribute('title', `${status.game}, Tags: ${tags}`);
        }
        
        // Update language if provided
        if (status.language) {
          const langCell = row.querySelector('td:nth-child(4)');
          if (langCell) langCell.innerText = status.language;
        }
      } else {
        statusCell.innerHTML = '&nbsp;';
      }
    });
  })
  .catch(err => console.error('Failed to load streamers from API:', err))
  .finally(() => {
    // Trigger initial sort regardless of fetch success or failure
    toggleOnlineSort(onlineHeader);
  });

/******************************************************************************
 *** Filtering
 *****************************************************************************/

function setupTags() {
  for (let td of table.querySelectorAll('td:nth-child(1)')) {
    td.parentElement.setAttribute('data-offline', td.innerText.trim().length === 0);
  }
}
setupTags();

function getLanguages() {
  const langs = new Set();
  for (let td of table.querySelectorAll('td:nth-child(4)')) {
    const content = td.innerText.trim();
    if (content.length > 0) {
      langs.add(content);
      td.parentElement.setAttribute('data-language', content);
    }
  }
  return langs;
}

const filters = new Map();
let offlineFiltered = false;
getLanguages().forEach(l => filters.set(l, true));

const filterStyles = document.head.appendChild(document.createElement('link'));
filterStyles.rel = 'stylesheet';

function updateStyles(filters, hideOffline) {
  // Update filters, sorry for complicated-ness
  const rules = Array.from(filters.entries()).filter(l => l[1] === false).map(l => `.streamer-table tr[data-language=${l[0]}]`);
  URL.revokeObjectURL(filterStyles.href);
  const parts = [];
  if (rules.length > 0) {
    parts.push(rules.join(',') + ' { display: none } ');
  }
  if (hideOffline) {
    parts.push('tr[data-offline=true] { display: none } ');
  }
  if (parts.length > 0) {
    const blob = new Blob(parts, { type: 'text/css' });
    filterStyles.href = URL.createObjectURL(blob);
  } else {
    filterStyles.href = '';
  }
  localStorage.setItem('saved-filters', JSON.stringify({ rules: Object.fromEntries(filters), hideOffline }));
}

{
  const savedFilters = localStorage.getItem('saved-filters');
  if (savedFilters !== null) {
    const { rules, hideOffline } = JSON.parse(savedFilters);
    for (let rule in rules) {
      filters.set(rule, rules[rule]);
    }
    updateStyles(filters, hideOffline);
    offlineFiltered = hideOffline;
  }
}

function generateLanguageModal() {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'modal');
  const fields = modal.appendChild(document.createElement('fieldset'));
  const legend = fields.appendChild(document.createElement('legend'));
  legend.innerText = 'Language filter';

  const inputs = new Array();
  for (let [language, filtered] of filters.entries()) {
    const ID = `filter-checkbox-${language}`;
    const input = fields.appendChild(document.createElement('input'));
    input.type = 'checkbox';
    input.name = language;
    input.checked = filtered;
    input.id = ID;
    const label = fields.appendChild(document.createElement('label'));
    label.setAttribute('for', ID);
    label.innerText = language;
    fields.appendChild(document.createElement('br'));

    inputs.push({ input, language });
  }

  fields.append(document.createElement('hr'));
  const hideOffline = fields.appendChild(document.createElement('input'));
  hideOffline.type = 'checkbox';
  hideOffline.checked = offlineFiltered;
  hideOffline.id = 'checkbox-hide-offline';
  const hideOfflineLabel = fields.appendChild(document.createElement('label'));
  hideOfflineLabel.innerText = 'Hide offline';
  hideOfflineLabel.setAttribute('for', 'checkbox-hide-offline');

  fields.appendChild(document.createElement('br'));

  const done = fields.appendChild(document.createElement('input'));
  done.type = 'submit';
  done.value = 'Done';
  done.style.width = '100%';

  function close() {
    for (let input of inputs) {
      filters.set(input.language, input.input.checked);
    }
    modal.remove();

    updateStyles(filters, hideOffline.checked);
    offlineFiltered = hideOffline.checked;

  }

  done.addEventListener('click', close, { once: true });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) close();
  }, { once: true });

  return modal;
}

try {
  document.getElementById('settings-button').addEventListener('click', function (e) {
    document.body.appendChild(generateLanguageModal());
  })
} catch (error) {}
