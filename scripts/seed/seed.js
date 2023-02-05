const fetch = require('node-fetch').default;
const path = require('path');
const fs = require('fs');

const USER_COUNT = 10;

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function loadData() {
  const buffer = await fs.promises.readFile(path.join(__dirname, './data.json'));
  return JSON.parse(buffer.toString());
}

async function createUser(i) {
  const req = await fetch('http://auth.wikit.eu/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `user${i}@mock.email`,
      username: `User${i}`,
      password: `Password${i}`
    })
  });

  return await req.json();
}

async function createUsers(count) {
  const tokens = [];

  for (let i = 1; i <= count; i++) {
    console.log(`Creating User ${i}/${count}...`);
    tokens.push((await createUser(i))[0]);
  }

  return tokens;
}

async function createWikit(title, text, text_difficulty, token) {
  const req = await fetch('http://data.wikit.eu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation($title: String!, $text: String!, $text_difficulty: Int!) {
          wikit: createWikit(title: $title, text: $text, text_difficulty: $text_difficulty, parents: [], children: [])
        }
      `,
      variables: { title, text, text_difficulty }
    })
  });

  return (await req.json()).data.wikit;
}

async function createText(wikit, text, difficulty, token) {
  const req = await fetch('http://data.wikit.eu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation($wikit: ID!, $text: String!, $difficulty: Int!) {
          text: createText(wikit: $wikit, text: $text, difficulty: $difficulty)
        }
      `,
      variables: { wikit, text, difficulty }
    })
  });

  return (await req.json()).data.text;
}

async function createRelation(parent, child, token) {
  const req = await fetch('http://data.wikit.eu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation($parent: ID!, $child: ID!) {
          relation: createRelation(parent: $parent, child: $child)
        }
      `,
      variables: { parent, child }
    })
  });

  return (await req.json()).data.relation;
}

async function rateText(text, rating, token) {
  const req = await fetch('http://rating.wikit.eu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation($text: ID!, $rating: Int!) {
          rateText(text: $text, rating: $rating)
        }
      `,
      variables: { text, rating }
    })
  });

  await req.json();
}

async function rateTextDifficulty(text, difficulty, token) {
  const req = await fetch('http://rating.wikit.eu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation($text: ID!, $difficulty: Int!) {
          rateTextDifficulty(text: $text, difficulty: $difficulty)
        }
      `,
      variables: { text, difficulty }
    })
  });

  await req.json();
}

async function rateRelation(relation, rating, token) {
  const req = await fetch('http://rating.wikit.eu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation($relation: ID!, $rating: Int!) {
          rateRelation(relation: $relation, rating: $rating)
        }
      `,
      variables: { relation, rating }
    })
  });

  await req.json();
}

async function seed() {
  const data = await loadData();

  const tokens = await createUsers(USER_COUNT);

  const wikits = {};
  for (const title of data.wikits) {
    console.log(`Creating Wikit '${title}'...`);
    const difficulty = Math.floor(Math.random() * 5) + 1;
    wikits[title] = await createWikit(title, data.texts[title][0], difficulty, random(tokens));
  }

  const texts = [];
  for (const title in data.texts) {
    for (let i = 1; i < data.texts[title].length; i++) {
      console.log(`Creating Text '${title}' #${i}...`);
      const difficulty = Math.floor(Math.random() * 5) + 1;
      texts.push(await createText(wikits[title], data.texts[title][i], difficulty, random(tokens)));
    }
  }

  const relations = [];
  for (const title in data.relations) {
    for (const child of data.relations[title]) {
      console.log(`Creating Relation '${title}' -> '${child}'...`);
      relations.push(await createRelation(wikits[title], wikits[child], random(tokens)));
    }
  }

  for (let i = 0; i < texts.length; i++) {
    for (let j = 1; j <= 5; j++) {
      console.log(`Rating Text ${i + 1}/${texts.length} #${j}...`);
      await rateText(texts[i], Math.floor(Math.random() * 5) + 1, random(tokens));
    }
  }

  for (let i = 0; i < texts.length; i++) {
    for (let j = 1; j <= 5; j++) {
      console.log(`Rating Text Difficulty ${i + 1}/${texts.length} #${j}...`);
      await rateTextDifficulty(texts[i], Math.floor(Math.random() * 5) + 1, random(tokens));
    }
  }

  for (let i = 0; i < relations.length; i++) {
    for (let j = 1; j <= 5; j++) {
      console.log(`Rating Relation ${i + 1}/${relations.length} #${j}...`);
      await rateRelation(relations[i], Math.floor(Math.random() * 5) + 1, random(tokens));
    }
  }
}

seed();
