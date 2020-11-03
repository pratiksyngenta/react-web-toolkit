var fs = require('fs');
var axios = require('axios');
var dir = './phraseapp/locales';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
// get phrase app branch according to the environment
const getBranch = () => {
  const mappings = {
    master: ''
  };
  let val = mappings[process.env.NODE_ENV];
  console.warn(`Phrase app | CI Branch ${process.env.NODE_ENV}`);
  if (val === undefined) {
    val = 'dev';
  }
  return val;
};

const loadLangFromPhrase = async () => {
  const host = 'https://api.phrase.com/v2';
  const accessToken = '<<ACCESS_TOKEN>>';
  const projectId = '<<PROJECT_ID>>';
  const branch = getBranch();
  const queryParams = `access_token=${accessToken}&file_format=i18next&branch=${branch}`;
  const baseURL = `${host}/projects/${projectId}/locales`;
  console.warn(`Phrase app | Branch ${branch}`);

  // Pulling all locales array
  const locales = await axios.get(`${baseURL}?${queryParams}`);
  console.warn(`Phrase app | Pulling data for languages: ${locales.data.map((l) => l.name)}`);

  // Pulling all translations for respective locale
  const promises = locales.data.map((locale) =>
    axios
      .get(`${baseURL}/${locale.id}/download?${queryParams}`)
      .then((res) => ({
        [locale.code]: {
          translation: res.data
        }
      }))
      .catch((err) => {
        console.warn(`Phrase app | Error while loading ${locale.code}: ${err}`);
        throw err;
      })
  );
  const localesArr = await Promise.all(promises);
  return (localesArr || []).reduce((a, b) => ({ ...b, ...a }), {});
};

(async () => {
  try {
    const data = await loadLangFromPhrase();
    fs.writeFile(`$${dir}/getLangData.json`, JSON.stringify(data), function(err) {
      if (err) {
        throw err;
      }
    });
    console.warn(`Phrase app | Data loaded successfully`);
  } catch (ex) {
    console.warn(`Phrase app | Error ${ex}`);
  }
})();
