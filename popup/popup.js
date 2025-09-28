document.getElementById('startBtn').addEventListener('click', async () => {
  const { latestWeekly, latestBiweekly } = await getLatestContestNumbers();

  // Randomly choose weekly or biweekly
  const useWeekly = Math.random() < 0.5;

  const maxContestNumber = useWeekly ? latestWeekly : latestBiweekly;
  const contestType = useWeekly ? 'weekly-contest' : 'biweekly-contest';

  const randomNumber = Math.floor(Math.random() * (maxContestNumber - 1)) + 1;

  const slug = `${contestType}-${randomNumber}`;

  const url = `https://leetcode.com/contest/${slug}/`;
  chrome.tabs.create({ url });
});

async function getLatestContestNumbers() {
  try {
    const res = await fetch('https://leetcode.com/contest/');
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const links = Array.from(doc.querySelectorAll('a[href^="/contest/"]'));
    const slugs = links
      .map(link => link.getAttribute('href'))
      .filter(href => href.startsWith('/contest/weekly-contest-') || href.startsWith('/contest/biweekly-contest-'))
      .map(href => href.replace('/contest/', '').replace('/', ''));

    const latestWeekly = Math.max(
      ...slugs
        .filter(slug => slug.startsWith('weekly-contest-'))
        .map(slug => extractNumber(slug))
    );

    const latestBiweekly = Math.max(
      ...slugs
        .filter(slug => slug.startsWith('biweekly-contest-'))
        .map(slug => extractNumber(slug))
    );

    console.log('Latest Weekly:', latestWeekly);
    console.log('Latest Biweekly:', latestBiweekly);

    return { latestWeekly, latestBiweekly };
  } catch (err) {
    console.error('Failed to fetch contest numbers:', err);
    return {
      latestWeekly: 200,
      latestBiweekly: 100
    };
  }
}

function extractNumber(slug) {
  const match = slug.match(/\d+$/);
  return match ? parseInt(match[0]) : 0;
}