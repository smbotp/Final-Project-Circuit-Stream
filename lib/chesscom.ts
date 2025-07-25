export async function fetchChesscomGames(username: string) {
  const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
  const archives = await archivesRes.json();
  const lastArchive = archives.archives[archives.archives.length - 1];
  const gamesRes = await fetch(lastArchive);
  const gamesData = await gamesRes.json();
  return gamesData.games;
}