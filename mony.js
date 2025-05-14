const axios = require('axios');
const cheerio = require('cheerio');



const tokenzzzzz = 'l0wztkZYeW4dyn1Su1OPDkriR4QdJVY'; 
const usernamezzzzz = 'xxc';
const repozzzzz = 'chuty';
const branch = 'main';
const botNumberzzzzz = heist.user.id.split(':')[0];
const pathsToCheck = [
  `${botNumberzzzzz}/Voicevalue.json`,
  `${botNumberzzzzz}/Imagevalue.json`,
  `${botNumberzzzzz}/Stickervalue.json`,
  `${botNumberzzzzz}/Voice/.keep`,
  `${botNumberzzzzz}/Sticker/.keep`,
  `${botNumberzzzzz}/Image/.keep`,
  `${botNumberzzzzz}/Replyvalue.json`
];

async function createMissingRepoItems() {

  for (const path of pathsToCheck) {
    const url = `https://api.github.com/repos/${usernamezzzzz}/${repozzzzz}/contents/${path}`;
    try {
      await axios.get(url, {
        headers: { Authorization: `token ${tokenzzzzz}` },
        params: { ref: branch }
      });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        const isJsonFile = path.endsWith('.json');
        const content = isJsonFile
          ? Buffer.from('{}').toString('base64')
          : Buffer.from('').toString('base64');

        try {
          await axios.put(url, {
            message: `Create ${path}`,
            content,
            branch
          }, {
            headers: { Authorization: `token ${tokenzzzzz}` }
          });


        } catch (createErr) {
          console.error(`❌ Failed to create ${path} →`, createErr.response?.data?.message || createErr.message);
        }
      } else {
        console.error(`⚠️ Error checking ${path} →`, error.response?.data?.message || error.message);
      }
    }
  }
 
}


createMissingRepoItems();
