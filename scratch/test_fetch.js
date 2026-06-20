async function test() {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Azteca_Uno_2022.svg/320px-Azteca_Uno_2022.svg.png';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KrynnTVLogoDownloader/1.0 (contact@krynntv.com; bot)'
      }
    });
    console.log(`Fetch Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response Body: ${text}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}
test();
