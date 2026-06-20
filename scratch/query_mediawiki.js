async function getUrl(fileName) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KrynnTVLogoDownloader/1.0 (contact@krynntv.com; bot)'
      }
    });
    const data = await res.json();
    console.log(`=== Result for ${fileName} ===`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error fetching ${fileName}: ${err.message}`);
  }
}

async function run() {
  await getUrl('Azteca_Uno_2022.svg');
  await getUrl('TV5Monde_Logo.svg');
  await getUrl('M6_2020.svg');
}
run();
