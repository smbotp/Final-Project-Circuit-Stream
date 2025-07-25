export async function fetchLichessGames(username: string) {
  const res = await fetch(
    `https://lichess.org/api/games/user/${username}?max=10&opening=true`,
    { headers: { Accept: "application/x-ndjson" } }
  );
  const text = await res.text();
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}