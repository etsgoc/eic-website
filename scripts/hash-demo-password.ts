// Run with: npm run hash-demo-password -- "somePassword"
// Prints a bcrypt hash you can paste into src/data/demo-credentials.json.
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-demo-password -- \"yourPassword\"");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);
});
