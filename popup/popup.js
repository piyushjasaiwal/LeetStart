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
    const res = await fetch("https://leetcode.com/contest/");
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const nextDataScript = doc.querySelector("#__NEXT_DATA__");

    if (!nextDataScript) {
      throw new Error("NEXT_DATA not found");
    }

    const data = JSON.parse(nextDataScript.textContent);

    const contests =
      data.props.pageProps.contests ||
      data.props.pageProps.dehydratedState?.queries
        ?.flatMap(q => q.state?.data ?? [])
        ?.flatMap(d => d?.contests ?? []) ||
      [];

    const weekly = contests
      .filter(c => c.titleSlug?.startsWith("weekly-contest-"))
      .map(c => extractNumber(c.titleSlug));

    const biweekly = contests
      .filter(c => c.titleSlug?.startsWith("biweekly-contest-"))
      .map(c => extractNumber(c.titleSlug));

    if (!weekly.length || !biweekly.length) {
      throw new Error("Contest lists empty");
    }

    return {
      latestWeekly: Math.max(...weekly),
      latestBiweekly: Math.max(...biweekly)
    };
  } catch (err) {
    console.error("Failed to fetch contest numbers:", err);

    // Safe fallback
    return {
      latestWeekly: 400,
      latestBiweekly: 130
    };
  }
}


