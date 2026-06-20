async function test() {
  const urls = [
    'http://localhost:3000/logos/azteca_uno.webp',
    'http://localhost:3000/logos/bein_sports.svg',
    'http://localhost:3000/logos/tv5monde.svg',
    'http://localhost:3000/logos/dw_sports.svg'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url} -> Status: ${res.status} (${res.statusText})`);
    } catch (err) {
      console.error(`Failed to fetch ${url}: ${err.message}`);
    }
  }
}
test();
