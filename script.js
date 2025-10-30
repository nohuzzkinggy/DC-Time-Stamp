const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const styleSelect = document.getElementById('style');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copy');
const discordPreview = document.getElementById('discordPreview');

function generateTimestamp() {
  const dateVal = dateInput.value;
  const timeVal = timeInput.value;
  if (!dateVal || !timeVal) return;

  const dateTime = new Date(`${dateVal}T${timeVal}:00Z`);
  const unix = Math.floor(dateTime.getTime() / 1000);
  const style = styleSelect.value;
  const tag = `<t:${unix}:${style}>`;

  output.value = tag;
  updatePreview(unix, style);
}

// Discord-style preview
function updatePreview(unix, style) {
  const date = new Date(unix * 1000);
  let preview = '';

  const options = {
    t: { hour: '2-digit', minute: '2-digit' },
    T: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    d: { year: 'numeric', month: '2-digit', day: '2-digit' },
    D: { year: 'numeric', month: 'long', day: 'numeric' },
    f: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    F: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  };

  if (style === 'R') {
    const diff = (Date.now() - unix * 1000) / 1000;
    const mins = Math.floor(Math.abs(diff) / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (diff > 0) {
      if (mins < 1) preview = 'just now';
      else if (mins < 60) preview = `${mins} minute${mins === 1 ? '' : 's'} ago`;
      else if (hours < 24) preview = `${hours} hour${hours === 1 ? '' : 's'} ago`;
      else preview = `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      if (mins < 1) preview = 'in a few seconds';
      else if (mins < 60) preview = `in ${mins} minute${mins === 1 ? '' : 's'}`;
      else if (hours < 24) preview = `in ${hours} hour${hours === 1 ? '' : 's'}`;
      else preview = `in ${days} day${days === 1 ? '' : 's'}`;
    }
  } else {
    preview = date.toLocaleString('en-US', options[style]);
  }

  discordPreview.textContent = preview;
}

// Buttons
document.getElementById('now').addEventListener('click', () => {
  const now = new Date();
  dateInput.value = now.toISOString().split('T')[0];
  timeInput.value = now.toISOString().split('T')[1].slice(0, 5);
  generateTimestamp();
});

document.getElementById('hour').addEventListener('click', () => {
  const baseDate = new Date();
  baseDate.setHours(baseDate.getHours() + 1);
  dateInput.value = baseDate.toISOString().split('T')[0];
  timeInput.value = baseDate.toISOString().split('T')[1].slice(0, 5);
  generateTimestamp();
});

document.getElementById('tomorrow').addEventListener('click', () => {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  dateInput.value = now.toISOString().split('T')[0];
  timeInput.value = '09:00';
  generateTimestamp();
});

document.getElementById('midnight').addEventListener('click', () => {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  dateInput.value = now.toISOString().split('T')[0];
  timeInput.value = '00:00';
  generateTimestamp();
});

// Copy button fixed
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy Tag'), 1000);
  } catch {
    alert('Copy failed! Try manually.');
  }
});

// Auto-update preview
dateInput.addEventListener('change', generateTimestamp);
timeInput.addEventListener('change', generateTimestamp);
styleSelect.addEventListener('
