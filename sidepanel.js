document.getElementById('startBtn').addEventListener('click', () => {
  getLatestContestSlug().then((contestSlug) => {
    const url = `https://leetcode.com/contest/${contestSlug}/`;
    chrome.tabs.create({ url });
  });
});

function getLatestContestSlug() {
  // Option 1: Hardcoded
  return Promise.resolve('weekly-contest-364');

  // Option 2: Fetch dynamically if needed
  // return fetch('https://leetcode.com/api/contest/')
  //   .then(res => res.json())
  //   .then(data => data.contests[0].slug);
}