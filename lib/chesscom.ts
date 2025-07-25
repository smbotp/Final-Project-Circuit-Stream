export async function fetchChesscomGames(username: string) {
  try {
    const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
    if (!archivesRes.ok) return [];
    const archives = await archivesRes.json();
    if (!archives.archives || archives.archives.length === 0) return [];
    const lastArchive = archives.archives[archives.archives.length - 1];
    const gamesRes = await fetch(lastArchive);
    if (!gamesRes.ok) return [];
    const gamesData = await gamesRes.json();
    // These games should have PGN!
    return gamesData.games || [];
  } catch (err) {
    console.error("Error fetching Chess.com games:", err);
    return [];
  }
}