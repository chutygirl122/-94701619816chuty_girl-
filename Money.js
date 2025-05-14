Money({
  pattern: "setvoice",
  desc: "Reply to an audio file and upload to GitHub",
  use: ".tovoice <name>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, quoted, args, q, isOwner }) => {
 
   if (!isOwner) return reply('🔴 Is Owner Only Command');

     if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර .setimage <name> ලෙස භාවිතා කරන්න.");
  if (q.split(" ").length > 1 || q.length > 30) return reply("කරුණාකර එක වචනයක් පමණක් (අක්ෂර 30 ට අඩු) යොදන්න.");
  if (!quoted || !quoted.msg || !quoted.download || !quoted.type.includes("audio")) {
    return reply("කරුණාකර mp3 ගොනුවකට හෝ voice msg එකකට reply කරන්න.");
  }

  const buffer = await quoted.download();
  if (!buffer) return reply("❌ ගොනුව බාගත විය නොහැක.");

  
  const maxSize = 5 * 1024 * 1024;
  if (Buffer.byteLength(buffer) > maxSize) {
    return reply("❌ ඔබ ලබා දී ඇති ඕඩියෝ ගොනුව 5MB ට වඩා විශාලය. කරුණාකර කුඩා ගොනුවක් ලබා දෙන්න.");
  }

  const botNumber = heist.user.id.split(':')[0];
  const filename = `${q}.mp3`;
  const filePath = path.join("./temp", filename);

  const token = 'ghp_5400FzyWYm1SB28uwScN621ZLQil';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const repoPath = `${botNumber}/Voice/${filename}`;
  const jsonPath = `${botNumber}/Voicevalue.json`;

  try {
    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

    
    let json = {};
    let sha_json = null;
    try {
      const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
        headers: { Authorization: `token ${token}` },
        params: { ref: branch }
      });
      json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
      sha_json = res.data.sha;
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }


    if (json[q]) {
      try {
        const delPath = `${botNumber}/Voice/${q}.mp3`;
        const delRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${delPath}`, {
          headers: { Authorization: `token ${token}` }
        });

        await axios.delete(`https://api.github.com/repos/${username}/${repo}/contents/${delPath}`, {
          headers: { Authorization: `token ${token}` },
          data: {
            message: `Delete old voice: ${filename}`,
            sha: delRes.data.sha,
            branch
          }
        });
      } catch (e) {
        console.warn("Warning: couldn't delete old file.");
      }

      delete json[q];
    }

    fs.writeFileSync(filePath, buffer);
    const base64 = fs.readFileSync(filePath, { encoding: 'base64' });


    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${repoPath}`, {
      message: `Upload ${filename}`,
      content: base64,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    
    json[q] = `https://github.com/${username}/${repo}/raw/${branch}/${botNumber}/Voice/${filename}`;

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Update ${jsonPath}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      ...(sha_json && { sha: sha_json }),
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    fs.unlinkSync(filePath);
    return reply(`✅ This Voice Set Auto Reply and Upload Success!`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return reply("❌ Upload එක අසාර්ථක විය.");
  }
});

Money({
  pattern: "getvoice",
  desc: "List all saved voice names",
  use: ".getvoice",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply }) => {
  

  const token = 'ghp_5400moxsaScN621ZLQil';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const botNumber = heist.user.id.split(':')[0];
  const jsonPath = `${botNumber}/Voicevalue.json`;

  try {
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    const json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
    const keys = Object.keys(json);

    if (keys.length === 0) return reply("❌ ඔබ විසුන් සුරකින ලද Voice නොමැත");
    const list = keys.map((k, i) => `${i + 1}. ${k}`).join('\n');
    return reply(`📂 Saved Voices:\n\n${list}`);
  } catch (err) {
    console.error("getvoice error:", err.response?.data || err.message);
    return reply("❌ List ලබාගැනීමේදී දෝෂයක් ඇතිවිය.");
  }
});


Money({
  pattern: "delvoice",
  desc: "Delete a saved voice file",
  use: ".delvoice <name>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, q, isOwner }) => {
  
if (!isOwner) return reply('🔴 Is Owner Only Command');
  

     if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර .delvoice <name> ලෙස භාවිතා කරන්න.");


  const token = 'ghp_5400FoxsavuwScN621ZLQil';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const botNumber = heist.user.id.split(':')[0];
  const jsonPath = `${botNumber}/Voicevalue.json`;
  const filePath = `${botNumber}/Voice/${q}.mp3`;

  try {
    
    const jsonRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    let json = JSON.parse(Buffer.from(jsonRes.data.content, 'base64').toString());
    const sha_json = jsonRes.data.sha;

    if (!json[q]) return reply(`❌ "${q}" යන නාමයට අදාළ කිසිදු voice එකක් ඔබ කලින් සුරකින නොලදි`);

    
    const fileRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    await axios.delete(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` },
      data: {
        message: `Delete voice file: ${q}.mp3`,
        sha: fileRes.data.sha,
        branch
      }
    });

    delete json[q];
    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Remove ${q} from Voicevalue.json`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      sha: sha_json,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    return reply(`✅ "${q}" සාර්ථකව මකාදැමියි.`);
  } catch (err) {
    console.error("delvoice error:", err.response?.data || err.message);
    return reply("❌ මකාදැමීමේදී දෝෂයක් ඇතිවිය.");
  }
});

Money({
  pattern: "setimage",
  desc: "Reply to an image and upload to GitHub",
  use: ".toimage <name>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, quoted, args, q, isOwner }) => {
if (!isOwner) return reply('🔴 Is Owner Only Command');
 
   if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර .setimage <name> ලෙස භාවිතා කරන්න.");
  const name = q.trim();
  if (name.split(" ").length > 1 || name.length > 30) return reply("කරුණාකර එක වචනයක් පමණක් (අක්ෂර 30 ට අඩු) යොදන්න.");

  if (!quoted || !quoted.msg || !quoted.download || !quoted.type.includes("image")) {
    return reply("කරුණාකර Photo වෙත reply කරන්න.");
  }

  const buffer = await quoted.download();
  if (!buffer) return reply("❌ Image බාගත විය නොහැක.");

  const maxSize = 5 * 1024 * 1024;
  if (Buffer.byteLength(buffer) > maxSize) {
    return reply("❌ ඔබ ලබා දී ඇති Photo එක 5MB ට වඩා විශාලය.");
  }   

  const botNumber = heist.user.id.split(':')[0];
  const filename = `${name}.jpg`;
  const filePath = path.join("./temp", filename);

  const token = 'ghp_gWBseaISQS2dXJ11NgjBW';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const repoPath = `${botNumber}/Image/${filename}`;
  const jsonPath = `${botNumber}/Imagevalue.json`;

  try {
    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

    let json = {};
    let sha_json = null;
    try {
      const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
        headers: { Authorization: `token ${token}` },
        params: { ref: branch }
      });
      json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
      sha_json = res.data.sha;
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }

    if (json[name]) {
      try {
        const delPath = `${botNumber}/Image/${name}.jpg`;
        const delRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${delPath}`, {
          headers: { Authorization: `token ${token}` }
        });

        await axios.delete(`https://api.github.com/repos/${username}/${repo}/contents/${delPath}`, {
          headers: { Authorization: `token ${token}` },
          data: {
            message: `Delete old image: ${filename}`,
            sha: delRes.data.sha,
            branch
          }
        });
      } catch (e) {
        console.warn("Warning: couldn't delete old image.");
      }

      delete json[name];
    }

    fs.writeFileSync(filePath, buffer);
    const base64 = fs.readFileSync(filePath, { encoding: 'base64' });

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${repoPath}`, {
      message: `Upload ${filename}`,
      content: base64,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    json[name] = `https://github.com/${username}/${repo}/raw/${branch}/${botNumber}/Image/${filename}`;

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Update ${jsonPath}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      ...(sha_json && { sha: sha_json }),
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    fs.unlinkSync(filePath);
    return reply(`✅ This Photo Set Auto Reply And Upload Success!`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return reply("❌ Upload එක අසාර්ථක විය.");
  }
});

Money({
  pattern: "setreply",
  desc: "Reply to a message and upload as auto-reply",
  use: ".toreply {\"real q\":\"your reply message\"}",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, args, q, isOwner }) => {
if (!isOwner) return reply('🔴 Is Owner Only Command');
  if (typeof q !== 'string' || !q.trim()) {
    return reply("කරුණාකර \`.setreply {\"Hi\":\"Hey How Are You\"}\` ලෙස භාවිතා කරන්න.");
  }

  let parsed;
  try {
    parsed = JSON.parse(q);
  } catch (e) {
    return reply("❌ JSON format එක වැරදියි.\nඋදාහරණයක්: \`.setreply {\"Hi\":\"Hello there!\"}\`");
  }

  const key = Object.keys(parsed)[0];
  const text = parsed[key];

  if (!key || key.split(" ").length > 1 || key.length > 30)
    return reply("කරුණාකර key එක ලෙස එක වචනයක් (අක්ෂර 30ට අඩු) ලබාදෙන්න.");

  if (!text || typeof text !== 'string')
    return reply("❌ message එක string format එකකින් යවන්න.");

  const botNumber = heist.user.id.split(':')[0];
  const token = 'ghp_OlP5FcjTTaZcNGEHrf5u2C2HYa';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const jsonPath = `${botNumber}/Replyvalue.json`;

  try {
    let json = {};
    let sha_json = null;

    try {
      const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
        headers: { Authorization: `token ${token}` },
        params: { ref: branch }
      });
      json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
      sha_json = res.data.sha;
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }

    json[key] = text;

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Update ${jsonPath} with ${key}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      ...(sha_json && { sha: sha_json }),
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    return reply(`✅ This Text Add Auto Reply List And Upload Success!\n\n🗝️: ${key}\n💬: ${text}`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return reply("❌ Upload එක අසාර්ථක විය.");
  }
});





Money({
  pattern: "setsticker",
  desc: "Reply to a sticker and upload to GitHub",
  use: ".tosticker <name>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, quoted, args, q, isOwner }) => {
if (!isOwner) return reply('🔴 Is Owner Only Command');
  if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර `.setsticker <name>` ලෙස භාවිතා කරන්න.");
  const name = q.trim();
  if (name.split(" ").length > 1 || name.length > 30) return reply("කරුණාකර එක වචනයක් පමණක් (අක්ෂර 30 ට අඩු) යොදන්න.");

  if (!quoted || !quoted.msg || !quoted.download || quoted.type !== "stickerMessage") {
    return reply("කරුණාකර sticker එකකට reply කරන්න.");
  }

  const buffer = await quoted.download();
  if (!buffer) return reply("❌ ගොනුව බාගත විය නොහැක.");

  const maxSize = 2 * 1024 * 1024;
  if (Buffer.byteLength(buffer) > maxSize) {
    return reply("❌ Sticker එක 2MB ට වඩා විශාලය.");
  }

  const botNumber = heist.user.id.split(':')[0];
  const filename = `${name}.webp`;
  const filePath = path.join("./temp", filename);

  const token = 'ghp_7bJspSvo2unbbSuFBZJs1G7Ebd';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const repoPath = `${botNumber}/Sticker/${filename}`;
  const jsonPath = `${botNumber}/Stickervalue.json`;

  try {
    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

    let json = {};
    let sha_json = null;
    try {
      const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
        headers: { Authorization: `token ${token}` },
        params: { ref: branch }
      });
      json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
      sha_json = res.data.sha;
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }

    if (json[name]) {
      try {
        const delPath = `${botNumber}/Sticker/${name}.webp`;
        const delRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${delPath}`, {
          headers: { Authorization: `token ${token}` }
        });

        await axios.delete(`https://api.github.com/repos/${username}/${repo}/contents/${delPath}`, {
          headers: { Authorization: `token ${token}` },
          data: {
            message: `Delete old sticker: ${filename}`,
            sha: delRes.data.sha,
            branch
          }
        });
      } catch (e) {
        console.warn("Warning: couldn't delete old sticker.");
      }

      delete json[name];
    }

    fs.writeFileSync(filePath, buffer);
    const base64 = fs.readFileSync(filePath, { encoding: 'base64' });

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${repoPath}`, {
      message: `Upload ${filename}`,
      content: base64,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    json[name] = `https://github.com/${username}/${repo}/raw/${branch}/${botNumber}/Sticker/${filename}`;

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Update ${jsonPath}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      ...(sha_json && { sha: sha_json }),
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    fs.unlinkSync(filePath);
    return reply(`✅ This Sticker Add Auto Reply List and Sticker Upload Success!`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return reply("❌ Upload එක අසාර්ථක විය.");
  }
});



Money({
  pattern: "getsticker",
  desc: "Get all uploaded sticker names",
  use: ".getsticker",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply }) => {
  
  const botNumber = heist.user.id.split(':')[0];

  const token = 'ghp_7bJspSvo2ubSuFBZJs1G7Ebd';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const jsonPath = `${botNumber}/Stickervalue.json`;

  try {
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    const json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
    const keys = Object.keys(json);

    if (keys.length === 0) return reply("❌ Sticker කිසිවක් සුරකිය නොමැත.");
    reply(`📌 Upload කරන ලද Sticker නම්:\n\n${keys.map((k, i) => `${i + 1}. ${k}`).join("\n")}`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    reply("❌ Sticker ලැයිස්තුව ලබාගැනීම අසාර්ථක විය.");
  }
});

Money({
  pattern: "delsticker",
  desc: "Delete a saved sticker from GitHub",
  use: ".delsticker <name>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, q, isOwner }) => {
  
if (!isOwner) return reply('🔴 Is Owner Only Command');
  

if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර .delsticker <name> ලෙස භාවිතා කරන්න.");

  const botNumber = heist.user.id.split(':')[0];
  const token = 'ghp_7bJsTnbbSuFBZJs1G7Ebd';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const jsonPath = `${botNumber}/Stickervalue.json`;
  const stickerPath = `${botNumber}/Sticker/${q}.webp`;

  try {
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    const json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
    const sha_json = res.data.sha;

    if (!json[q]) return reply("❌ එවැනි sticker එකක් සුරකිය නොමැත.");

    const delRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${stickerPath}`, {
      headers: { Authorization: `token ${token}` }
    });

    await axios.delete(`https://api.github.com/repos/${username}/${repo}/contents/${stickerPath}`, {
      headers: { Authorization: `token ${token}` },
      data: {
        message: `Delete sticker: ${q}.webp`,
        sha: delRes.data.sha,
        branch
      }
    });

    delete json[q];

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Update ${jsonPath}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      sha: sha_json,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    reply("✅ Sticker එක ඉවත් කරන ලදී.");
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    reply("❌ Sticker එක ඉවත් කිරීම අසාර්ථක විය.");
  }
});

Money({
  pattern: "getreply",
  desc: "Get all uploaded auto-replies",
  use: ".getreply",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply }) => {
  
  const botNumber = heist.user.id.split(':')[0];
  const token = 'ghp_OlP5FcjTZcNGEHrf5u2C2HYa';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const jsonPath = `${botNumber}/Replyvalue.json`;

  try {
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    const json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
    const keys = Object.keys(json);

    if (keys.length === 0) return reply("❌ Reply කිසිවක් සුරකිය නොමැත.");
    
    reply(`📋 Upload කරන ලද Reply list එක:\n\n${keys.map((k, i) => `${i + 1}. ${k} : ${json[k]}`).join("\n")}`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    reply("❌ Reply list එක ලබා ගැනීම අසාර්ථක විය.");
  }
});


Money({
  pattern: "delreply",
  desc: "Delete a saved reply from GitHub",
  use: ".delreply <key>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, q, isOwner }) => {
if (!isOwner) return reply('🔴 Is Owner Only Command');


if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර .delreply <key> ලෙස භාවිතා කරන්න.");


  const botNumber = heist.user.id.split(':')[0];
  const token = 'ghp_OlP5FcjTTNGEHrf5u2C2HYa';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const jsonPath = `${botNumber}/Replyvalue.json`;

  try {
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    const json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
    const sha_json = res.data.sha;

    if (!json[q]) return reply("❌ එවැනි reply එකක් සුරකිය නොමැත.");

    delete json[q];

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Delete reply key: ${q}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      sha: sha_json,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    reply(`✅ Reply key '${q}' ඉවත් කරන ලදී.`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    reply("❌ Reply එක ඉවත් කිරීම අසාර්ථක විය.");
  }
});

Money({
  pattern: "getimage",
  desc: "List all uploaded images",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply }) => {

  const botNumber = heist.user.id.split(':')[0];
  const token = 'ghp_gWBseaIS0DKkPo2dXJ11NgjBW';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const jsonPath = `${botNumber}/Imagevalue.json`;

  try {
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      headers: { Authorization: `token ${token}` },
      params: { ref: branch }
    });

    const json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());

    if (!Object.keys(json).length) return reply("⚠️ කිසිම රූපයක් upload කරලා නෑ.");

    let list = `🖼️ *Uploaded Images List:*\n\n`;
    for (const [name, url] of Object.entries(json)) {
      list += `• *${name}*\n`;
    }

    return reply(list.trim());
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return reply("❌ Image list එක ගන්න අසාර්ථක වුණා.");
  }
});

Money({
  pattern: "delimage",
  desc: "Delete an uploaded image from GitHub",
  use: ".delimage <name>",
  category: "utility",
  filename: __filename
}, async (heist, mek, m, { reply, args, q, isOwner }) => {
if (!isOwner) return reply('🔴 Is Owner Only Command');
  

 if (typeof q !== 'string' || !q.trim()) return reply("කරුණාකර .delimage <name> ලෙස භාවිතා කරන්න.");
  
   
     const botNumber = heist.user.id.split(':')[0];
  const token = 'ghp_gWBseaISVbG1eDKkPo2dXJ11NgjBW';
  const username = 'xxxxx';
  const repo = 'xxxxf';
  const branch = 'main';
  const filename = `${q}.jpg`;
  const filePath = `${botNumber}/Image/${filename}`;
  const jsonPath = `${botNumber}/Imagevalue.json`;

  try {
    
    let json = {};
    let sha_json = null;

    try {
      const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
        headers: { Authorization: `token ${token}` },
        params: { ref: branch }
      });

      json = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
      sha_json = res.data.sha;
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }

    if (!json[q]) return reply("❌ එම නාමයෙන් image එකක් හමු නොවීය.");

    const fileRes = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    await axios.delete(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` },
      data: {
        message: `Delete image: ${filename}`,
        sha: fileRes.data.sha,
        branch
      }
    });

    delete json[q];

    await axios.put(`https://api.github.com/repos/${username}/${repo}/contents/${jsonPath}`, {
      message: `Update ${jsonPath} after deletion`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString('base64'),
      ...(sha_json && { sha: sha_json }),
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    return reply(`✅ Successfully deleted image: *${q}*`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return reply("❌ Delete එක අසාර්ථක විය.");
  }
});
