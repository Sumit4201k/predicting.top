const fs = require('fs');

function test() {
  const js = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/1c72dd7a-4898-48ca-92d5-fd211beab575/scratch/leaderboard_chunk.js', 'utf8');
  console.log("Searching Qe import...");
  
  // Find where Qe is declared/defined, e.g. "Qe=" or "import Qe" or similar
  // Let's do a search for Qe = 
  const regex = /[^a-zA-Z]Qe\s*=\s*/g;
  let m;
  while ((m = regex.exec(js)) !== null) {
    console.log("Found definition:");
    console.log(js.substring(m.index - 50, m.index + 200));
  }
}

test();
