import { Chess } from "chess.js";

// Extract engine evals from Lichess PGN comments
function getMoveEvalsFromPgn(pgn: string): (number | null)[] {
  const evalRegex = /\{\s*\[%eval\s+([^\]\s]+)\s*\}/g;
  const evals: (number | null)[] = [];
  let match;
  while ((match = evalRegex.exec(pgn)) !== null) {
    let val = match[1];
    if (val.startsWith("#")) {
      evals.push(null); // mate score, skip or set as null
    } else {
      evals.push(parseFloat(val) * 100); // convert to centipawns
    }
  }
  return evals;
}

// Local Stockfish.js analysis (DISABLED)
export async function getEval(fen: string): Promise<number | null> {
  // Stockfish disabled for now
  return null;
}

// Clean and normalize PGN for chess.js
function cleanPgn(pgn: string): { cleanPgn: string, initialFen?: string } {
  let cleanPgn = pgn.replace(/\{[^}]*\}/g, "").replace(/\s+\n/g, "\n").trim();
  cleanPgn = cleanPgn.replace(/\[SetUp "1"\]\s*/g, "").replace(/\[FEN "[^"]*"\]\s*/g, "");
  cleanPgn = cleanPgn.replace(/(\d+)\.\s*([^\d]+?)\s*\d+\.\.\.\s*([^\d]+)/g, '$1. $2 $3');
  cleanPgn = cleanPgn.replace(/\s{2,}/g, ' ');
  cleanPgn = cleanPgn.replace(/\[CurrentPosition "[^"]*"\]\s*/g, "");
  let initialFen: string | undefined;
  const fenTag = pgn.match(/\[FEN "([^"]+)"\]/);
  if (fenTag) initialFen = fenTag[1];
  return { cleanPgn, initialFen };
}

// Find blunder puzzles in a single game
export async function findBlunderPuzzles(game: { pgn: string }) {
  const { cleanPgn: cleanedPgn, initialFen } = cleanPgn(game.pgn);
  const chess = initialFen ? new Chess(initialFen) : new Chess();

  try {
    chess.loadPgn(cleanedPgn);
  } catch (err) {
    console.error("PGN for chess.js:", cleanedPgn);
    throw new Error("Failed to parse PGN");
  }

  const moves = chess.history({ verbose: true });
  const puzzles = [];

  // Try to extract evals from PGN
  const extractedEvals = getMoveEvalsFromPgn(game.pgn);

  chess.reset();
  if (initialFen) chess.load(initialFen);

  for (let i = 0; i < moves.length; i++) {
    let evalBefore: number | null, evalAfter: number | null;

    // If we have extracted evals for every move, use them
    if (extractedEvals.length >= moves.length + 1) {
      evalBefore = extractedEvals[i];
      evalAfter = extractedEvals[i + 1];
      chess.reset();
      if (initialFen) chess.load(initialFen);
      for (let j = 0; j < i; j++) chess.move(moves[j]);
      const fenBefore = chess.fen();
      if (
        evalBefore !== null &&
        evalAfter !== null &&
        evalBefore - evalAfter > 200
      ) {
        puzzles.push({
          fen: fenBefore,
          blunderMove: moves[i].san,
          evalDrop: evalBefore - evalAfter,
          moveNumber: i + 1,
        });
      }
    } else {
      // Fallback: run Stockfish locally
      chess.reset();
      if (initialFen) chess.load(initialFen);
      for (let j = 0; j < i; j++) chess.move(moves[j]);
      const fenBefore = chess.fen();
      evalBefore = await getEval(fenBefore);

      chess.move(moves[i]);
      const fenAfter = chess.fen();
      evalAfter = await getEval(fenAfter);

      if (
        evalBefore !== null &&
        evalAfter !== null &&
        evalBefore - evalAfter > 200
      ) {
        puzzles.push({
          fen: fenBefore,
          blunderMove: moves[i].san,
          evalDrop: evalBefore - evalAfter,
          moveNumber: i + 1,
        });
      }
    }
  }

  return puzzles;
}

// Analyze multiple games and aggregate puzzles
export async function processGames(allGames: { pgn: string }[]) {
  let puzzles: any[] = [];
  for (const game of allGames) {
    if (game.pgn) {
      try {
        const gamePuzzles = await findBlunderPuzzles(game);
        puzzles = puzzles.concat(gamePuzzles);
      } catch (err) {
        console.error("Error in findBlunderPuzzles for game:", game, err);
      }
    }
  }
  return puzzles;
}

// Save puzzles to localStorage
export function savePuzzlesToLocal(puzzles: any[]) {
  localStorage.setItem('chessPuzzles', JSON.stringify(puzzles));
}

// Load puzzles from localStorage
export function loadPuzzlesFromLocal(): any[] {
  const data = localStorage.getItem('chessPuzzles');
  return data ? JSON.parse(data) : [];
}

// Process recent games from Chess.com and Lichess
export async function processRecentGames(chessComGames: { pgn: string }[], lichessGames: { pgn: string }[]) {
  const limitedChessComGames = chessComGames.slice(-30);
  const limitedLichessGames = lichessGames.slice(-30);
  const allGames = [...limitedChessComGames, ...limitedLichessGames];
  return await processGames(allGames);
}

// Analyze openings and results from games
export function getOpeningsStats(games: { pgn: string, result?: string }[]) {
  const openingStats: Record<string, { eco: string, name: string, count: number, wins: number, losses: number, draws: number }> = {};

  for (const game of games) {
    if (!game.pgn) continue;
    const chess = new Chess();
    try {
      chess.loadPgn(game.pgn);
    } catch {
      continue;
    }
    // Extract ECO and Opening name
    const ecoTag = game.pgn.match(/\[ECO "([^"]+)"\]/);
    const openingTag = game.pgn.match(/\[Opening "([^"]+)"\]/);
    const eco = ecoTag ? ecoTag[1] : "";
    const name = openingTag
      ? openingTag[1]
      : (eco && ECO_NAMES[eco])
        ? ECO_NAMES[eco]
        : ""; // Don't reference key here

    // Use opening name if available, else ECO code, else first 4 moves
    let key = name || eco;
    if (!key) {
      const moves = chess.history();
      key = moves.slice(0, 4).join(" ");
      if (!key) key = "Unknown Opening";
    }

    if (!openingStats[key]) {
      openingStats[key] = { eco, name: name || key, count: 0, wins: 0, losses: 0, draws: 0 };
    }
    openingStats[key].count += 1;

    // Get result from PGN tags or game.result
    let result = game.result;
    if (!result) {
      const resultTag = game.pgn.match(/\[Result "([^"]+)"\]/);
      result = resultTag ? resultTag[1] : "*";
    }

    if (result === "1-0") openingStats[key].wins += 1;
    else if (result === "0-1") openingStats[key].losses += 1;
    else if (result === "1/2-1/2") openingStats[key].draws += 1;
  }

  // Convert to array and sort by count
  return Object.entries(openingStats)
    .map(([key, stats]) => ({
      ...stats,
      winPct: stats.count ? Math.round((stats.wins / stats.count) * 100) : 0,
      lossPct: stats.count ? Math.round((stats.losses / stats.count) * 100) : 0,
      drawPct: stats.count ? Math.round((stats.draws / stats.count) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// In your dashboard rendering:

export const ECO_NAMES: Record<string, string> = {
  "A00": "Uncommon Opening",
  "A01": "Nimzovich-Larsen Attack",
  "A02": "Bird's Opening",
  "A03": "Bird's Opening",
  "A04": "Réti Opening",
  "A05": "Réti Opening",
  "A06": "Réti Opening",
  "A07": "King's Indian Attack",
  "A08": "King's Indian Attack",
  "A09": "Réti Opening",
  "A10": "English Opening",
  "A11": "English Opening",
  "A12": "English Opening",
  "A13": "English Opening",
  "A14": "English Opening",
  "A15": "English Opening",
  "A16": "English Opening",
  "A17": "English Opening",
  "A18": "English Opening",
  "A19": "English Opening",
  "A20": "English Opening",
  "A21": "English Opening",
  "A22": "English Opening",
  "A23": "English Opening",
  "A24": "English Opening",
  "A25": "English Opening",
  "A26": "English Opening",
  "A27": "English Opening",
  "A28": "English Opening",
  "A29": "English Opening",
  "A30": "English Opening",
  "A31": "English Opening",
  "A32": "English Opening",
  "A33": "English Opening",
  "A34": "English Opening",
  "A35": "English Opening",
  "A36": "English Opening",
  "A37": "English Opening",
  "A38": "English Opening",
  "A39": "English Opening",
  "A40": "Queen's Pawn Opening",
  "A41": "Queen's Pawn Opening",
  "A42": "Modern Defense",
  "A43": "Old Benoni Defense",
  "A44": "Old Benoni Defense",
  "A45": "Queen's Pawn Game",
  "A46": "Queen's Pawn Game",
  "A47": "Queen's Indian Defense",
  "A48": "King's Indian, East Indian Defense",
  "A49": "King's Indian, Fianchetto without c4",
  "A50": "Queen's Pawn Game",
  "A51": "Budapest Gambit",
  "A52": "Budapest Gambit",
  "A53": "Old Indian Defense",
  "A54": "Old Indian Defense",
  "A55": "Old Indian Defense",
  "A56": "Benoni Defense",
  "A57": "Benko Gambit",
  "A58": "Benko Gambit",
  "A59": "Benko Gambit",
  "A60": "Benoni Defense",
  "A61": "Benoni Defense",
  "A62": "Benoni Defense",
  "A63": "Benoni Defense",
  "A64": "Benoni Defense",
  "A65": "Benoni Defense",
  "A66": "Benoni Defense",
  "A67": "Benoni Defense",
  "A68": "Benoni Defense",
  "A69": "Benoni Defense",
  "A70": "Benoni Defense",
  "A71": "Benoni Defense",
  "A72": "Benoni Defense",
  "A73": "Benoni Defense",
  "A74": "Benoni Defense",
  "A75": "Benoni Defense",
  "A76": "Benoni Defense",
  "A77": "Benoni Defense",
  "A78": "Benoni Defense",
  "A79": "Benoni Defense",
  "A80": "Dutch Defense",
  "A81": "Dutch Defense",
  "A82": "Dutch Defense",
  "A83": "Dutch Defense",
  "A84": "Dutch Defense",
  "A85": "Dutch Defense",
  "A86": "Dutch Defense",
  "A87": "Dutch Defense",
  "A88": "Dutch Defense",
  "A89": "Dutch Defense",
  "A90": "Dutch Defense",
  "A91": "Dutch Defense",
  "A92": "Dutch Defense",
  "A93": "Dutch Defense",
  "A94": "Dutch Defense",
  "A95": "Dutch Defense",
  "A96": "Dutch Defense",
  "A97": "Dutch Defense",
  "A98": "Dutch Defense",
  "A99": "Dutch Defense",
  "B00": "King's Pawn Opening",
  "B01": "Scandinavian Defense",
  "B02": "Alekhine's Defense",
  "B03": "Alekhine's Defense",
  "B04": "Alekhine's Defense",
  "B05": "Alekhine's Defense",
  "B06": "Robatsch (Modern) Defense",
  "B07": "Pirc Defense",
  "B08": "Pirc Defense",
  "B09": "Pirc Defense",
  "B10": "Caro-Kann Defense",
  "B11": "Caro-Kann Defense",
  "B12": "Caro-Kann Defense",
  "B13": "Caro-Kann Defense: Exchange Variation",
  "B14": "Caro-Kann Defense",
  "B15": "Caro-Kann Defense",
  "B16": "Caro-Kann Defense",
  "B17": "Caro-Kann Defense",
  "B18": "Caro-Kann Defense",
  "B19": "Caro-Kann Defense",
  "B20": "Sicilian Defense",
  "B21": "Sicilian Defense",
  "B22": "Sicilian Defense",
  "B23": "Sicilian Defense",
  "B24": "Sicilian Defense",
  "B25": "Sicilian Defense",
  "B26": "Sicilian Defense",
  "B27": "Sicilian Defense",
  "B28": "Sicilian Defense",
  "B29": "Sicilian Defense",
  "B30": "Sicilian Defense",
  "B31": "Sicilian Defense",
  "B32": "Sicilian Defense",
  "B33": "Sicilian Defense",
  "B34": "Sicilian Defense",
  "B35": "Sicilian Defense",
  "B36": "Sicilian Defense",
  "B37": "Sicilian Defense",
  "B38": "Sicilian Defense",
  "B39": "Sicilian Defense",
  "B40": "Sicilian Defense",
  "B41": "Sicilian Defense",
  "B42": "Sicilian Defense",
  "B43": "Sicilian Defense",
  "B44": "Sicilian Defense",
  "B45": "Sicilian Defense",
  "B46": "Sicilian Defense",
  "B47": "Sicilian Defense",
  "B48": "Sicilian Defense",
  "B49": "Sicilian Defense",
  "B50": "Sicilian Defense",
  "B51": "Sicilian Defense",
  "B52": "Sicilian Defense",
  "B53": "Sicilian Defense",
  "B54": "Sicilian Defense",
  "B55": "Sicilian Defense",
  "B56": "Sicilian Defense",
  "B57": "Sicilian Defense",
  "B58": "Sicilian Defense",
  "B59": "Sicilian Defense",
  "B60": "Sicilian Defense",
  "B61": "Sicilian Defense",
  "B62": "Sicilian Defense",
  "B63": "Sicilian Defense",
  "B64": "Sicilian Defense",
  "B65": "Sicilian Defense",
  "B66": "Sicilian Defense",
  "B67": "Sicilian Defense",
  "B68": "Sicilian Defense",
  "B69": "Sicilian Defense",
  "B70": "Sicilian Defense",
  "B71": "Sicilian Defense",
  "B72": "Sicilian Defense",
  "B73": "Sicilian Defense",
  "B74": "Sicilian Defense",
  "B75": "Sicilian Defense",
  "B76": "Sicilian Defense",
  "B77": "Sicilian Defense",
  "B78": "Sicilian Defense",
  "B79": "Sicilian Defense",
  "B80": "Sicilian Defense",
  "B81": "Sicilian Defense",
  "B82": "Sicilian Defense",
  "B83": "Sicilian Defense",
  "B84": "Sicilian Defense",
  "B85": "Sicilian Defense",
  "B86": "Sicilian Defense",
  "B87": "Sicilian Defense",
  "B88": "Sicilian Defense",
  "B89": "Sicilian Defense",
  "B90": "Sicilian Defense",
  "B91": "Sicilian Defense",
  "B92": "Sicilian Defense",
  "B93": "Sicilian Defense",
  "B94": "Sicilian Defense",
  "B95": "Sicilian Defense",
  "B96": "Sicilian Defense",
  "B97": "Sicilian Defense",
  "B98": "Sicilian Defense",
  "B99": "Sicilian Defense",
  "C00": "French Defense",
  "C01": "French Defense",
  "C02": "French Defense",
  "C03": "French Defense",
  "C04": "French Defense",
  "C05": "French Defense",
  "C06": "French Defense",
  "C07": "French Defense",
  "C08": "French Defense",
  "C09": "French Defense",
  "C10": "French Defense",
  "C11": "French Defense",
  "C12": "French Defense",
  "C13": "French Defense",
  "C14": "French Defense",
  "C15": "French Defense",
  "C16": "French Defense",
  "C17": "French Defense",
  "C18": "French Defense",
  "C19": "French Defense",
  "C20": "King's Pawn Game",
  "C21": "Center Game",
  "C22": "Center Game",
  "C23": "Center Game",
  "C24": "Center Game",
  "C25": "Vienna Game",
  "C26": "Vienna Game",
  "C27": "Vienna Game",
  "C28": "Vienna Game",
  "C29": "Vienna Game",
  "C30": "King's Gambit",
  "C31": "King's Gambit",
  "C32": "King's Gambit",
  "C33": "King's Gambit",
  "C34": "King's Gambit",
  "C35": "King's Gambit",
  "C36": "King's Gambit",
  "C37": "King's Gambit",
  "C38": "King's Gambit",
  "C39": "King's Gambit",
  "C40": "King's Knight Opening",
  "C41": "Philidor Defense",
  "C42": "Petrov Defense",
  "C43": "Petrov Defense",
  "C44": "Petrov Defense",
  "C45": "Scotch Game",
  "C46": "Three Knights Game",
  "C47": "Four Knights Game",
  "C48": "Four Knights Game",
  "C49": "Four Knights Game",
  "C50": "Italian Game",
  "C51": "Italian Game",
  "C52": "Italian Game",
  "C53": "Italian Game",
  "C54": "Italian Game",
  "C55": "Italian Game",
  "C56": "Italian Game",
  "C57": "Italian Game",
  "C58": "Italian Game",
  "C59": "Italian Game",
  "C60": "Ruy Lopez",
  "C61": "Ruy Lopez",
  "C62": "Ruy Lopez",
  "C63": "Ruy Lopez",
  "C64": "Ruy Lopez",
  "C65": "Ruy Lopez",
  "C66": "Ruy Lopez",
  "C67": "Ruy Lopez",
  "C68": "Ruy Lopez",
  "C69": "Ruy Lopez",
  "C70": "Ruy Lopez",
  "C71": "Ruy Lopez",
  "C72": "Ruy Lopez",
  "C73": "Ruy Lopez",
  "C74": "Ruy Lopez",
  "C75": "Ruy Lopez",
  "C76": "Ruy Lopez",
  "C77": "Ruy Lopez",
  "C78": "Ruy Lopez",
  "C79": "Ruy Lopez",
  "C80": "Ruy Lopez",
  "C81": "Ruy Lopez",
  "C82": "Ruy Lopez",
  "C83": "Ruy Lopez",
  "C84": "Ruy Lopez",
  "C85": "Ruy Lopez",
  "C86": "Ruy Lopez",
  "C87": "Ruy Lopez",
  "C88": "Ruy Lopez",
  "C89": "Ruy Lopez",
  "D00": "Queen's Pawn Game",
  "D01": "Richter-Veresov Attack",
  "D02": "Queen's Pawn Game",
  "D03": "Torre Attack",
  "D04": "Queen's Pawn Game",
  "D05": "Queen's Pawn Game",
  "D06": "Queen's Gambit",
  "D07": "Queen's Gambit Declined",
  "D08": "Queen's Gambit Declined",
  "D09": "Queen's Gambit Declined",
  "D10": "Queen's Gambit Accepted",
  "D11": "Queen's Gambit Accepted",
  "D12": "Queen's Gambit Accepted",
  "D13": "Queen's Gambit Accepted",
  "D14": "Queen's Gambit Accepted",
  "D15": "Queen's Gambit Accepted",
  "D16": "Queen's Gambit Accepted",
  "D17": "Queen's Gambit Accepted",
  "D18": "Queen's Gambit Accepted",
  "D19": "Queen's Gambit Accepted",
  "D20": "Queen's Gambit Accepted",
  "D21": "Queen's Gambit Accepted",
  "D22": "Queen's Gambit Accepted",
  "D23": "Queen's Gambit Accepted",
  "D24": "Queen's Gambit Accepted",
  "D25": "Queen's Gambit Accepted",
  "D26": "Queen's Gambit Accepted",
  "D27": "Queen's Gambit Accepted",
  "D28": "Queen's Gambit Accepted",
  "D29": "Queen's Gambit Accepted",
  "D30": "Queen's Gambit Declined",
  "D31": "Queen's Gambit Declined",
  "D32": "Queen's Gambit Declined",
  "D33": "Queen's Gambit Declined",
  "D34": "Queen's Gambit Declined",
  "D35": "Queen's Gambit Declined",
  "D36": "Queen's Gambit Declined",
  "D37": "Queen's Gambit Declined",
  "D38": "Queen's Gambit Declined",
  "D39": "Queen's Gambit Declined",
  "D40": "Queen's Gambit Declined",
  "D41": "Queen's Gambit Declined",
  "D42": "Queen's Gambit Declined",
  "D43": "Queen's Gambit Declined",
  "D44": "Queen's Gambit Declined",
  "D45": "Queen's Gambit Declined",
  "D46": "Queen's Gambit Declined",
  "D47": "Queen's Gambit Declined",
  "D48": "Queen's Gambit Declined",
  "D49": "Queen's Gambit Declined",
  "D50": "Queen's Gambit Declined",
  "D51": "Queen's Gambit Declined",
  "D52": "Queen's Gambit Declined",
  "D53": "Queen's Gambit Declined",
  "D54": "Queen's Gambit Declined",
  "D55": "Queen's Gambit Declined",
  "D56": "Queen's Gambit Declined",
  "D57": "Queen's Gambit Declined",
  "D58": "Queen's Gambit Declined",
  "D59": "Queen's Gambit Declined",
  "D60": "Queen's Gambit Declined",
  "D61": "Queen's Gambit Declined",
  "D62": "Queen's Gambit Declined",
  "D63": "Queen's Gambit Declined",
  "D64": "Queen's Gambit Declined",
  "D65": "Queen's Gambit Declined",
  "D66": "Queen's Gambit Declined",
  "D67": "Queen's Gambit Declined",
  "D68": "Queen's Gambit Declined",
  "D69": "Queen's Gambit Declined",
  "D70": "Neo-Grünfeld Defense",
  "D71": "Neo-Grünfeld Defense",
  "D72": "Neo-Grünfeld Defense",
  "D73": "Neo-Grünfeld Defense",
  "D74": "Neo-Grünfeld Defense",
  "D75": "Neo-Grünfeld Defense",
  "D76": "Neo-Grünfeld Defense",
  "D77": "Neo-Grünfeld Defense",
  "D78": "Neo-Grünfeld Defense",
  "D79": "Neo-Grünfeld Defense",
  "D80": "Grünfeld Defense",
  "D81": "Grünfeld Defense",
  "D82": "Grünfeld Defense",
  "D83": "Grünfeld Defense",
  "D84": "Grünfeld Defense",
  "D85": "Grünfeld Defense",
  "D86": "Grünfeld Defense",
  "D87": "Grünfeld Defense",
  "D88": "Grünfeld Defense",
  "D89": "Grünfeld Defense",
  "E00": "Catalan Opening",
  "E01": "Catalan Opening",
  "E02": "Catalan Opening",
  "E03": "Catalan Opening",
  "E04": "Catalan Opening",
  "E05": "Catalan Opening",
  "E06": "Catalan Opening",
  "E07": "Catalan Opening",
  "E08": "Catalan Opening",
  "E09": "Catalan Opening",
  "E10": "Queen's Pawn Game",
  "E11": "Bogo-Indian Defense",
  "E12": "Queen's Indian Defense",
  "E13": "Queen's Indian Defense",
  "E14": "Queen's Indian Defense",
  "E15": "Queen's Indian Defense",
  "E16": "Queen's Indian Defense",
  "E17": "Queen's Indian Defense",
  "E18": "Queen's Indian Defense",
  "E19": "Queen's Indian Defense",
  "E20": "Nimzo-Indian Defense",
  "E21": "Nimzo-Indian Defense",
  "E22": "Nimzo-Indian Defense",
  "E23": "Nimzo-Indian Defense",
  "E24": "Nimzo-Indian Defense",
  "E25": "Nimzo-Indian Defense",
  "E26": "Nimzo-Indian Defense",
  "E27": "Nimzo-Indian Defense",
  "E28": "Nimzo-Indian Defense",
  "E29": "Nimzo-Indian Defense",
  "E30": "Nimzo-Indian Defense",
  "E31": "Nimzo-Indian Defense",
  "E32": "Nimzo-Indian Defense",
  "E33": "Nimzo-Indian Defense",
  "E34": "Nimzo-Indian Defense",
  "E35": "Nimzo-Indian Defense",
  "E36": "Nimzo-Indian Defense",
  "E37": "Nimzo-Indian Defense",
  "E38": "Nimzo-Indian Defense",
  "E39": "Nimzo-Indian Defense",
  "E40": "Nimzo-Indian Defense",
  "E41": "Nimzo-Indian Defense",
  "E42": "Nimzo-Indian Defense",
  "E43": "Nimzo-Indian Defense",
  "E44": "Nimzo-Indian Defense",
  "E45": "Nimzo-Indian Defense",
  "E46": "Nimzo-Indian Defense",
  "E47": "Nimzo-Indian Defense",
  "E48": "Nimzo-Indian Defense",
  "E49": "Nimzo-Indian Defense",
  "E50": "Nimzo-Indian Defense",
  "E51": "Nimzo-Indian Defense",
  "E52": "Nimzo-Indian Defense",
  "E53": "Nimzo-Indian Defense",
  "E54": "Nimzo-Indian Defense",
  "E55": "Nimzo-Indian Defense",
  "E56": "Nimzo-Indian Defense",
  "E57": "Nimzo-Indian Defense",
  "E58": "Nimzo-Indian Defense",
  "E59": "Nimzo-Indian Defense",
  "E60": "King's Indian Defense",
  "E61": "King's Indian Defense",
  "E62": "King's Indian Defense",
  "E63": "King's Indian Defense",
  "E64": "King's Indian Defense",
  "E65": "King's Indian Defense",
  "E66": "King's Indian Defense",
  "E67": "King's Indian Defense",
  "E68": "King's Indian Defense",
  "E69": "King's Indian Defense",
  "E70": "King's Indian Defense",
  "E71": "King's Indian Defense",
  "E72": "King's Indian Defense",
  "E73": "King's Indian Defense",
  "E74": "King's Indian Defense",
  "E75": "King's Indian Defense",
  "E76": "King's Indian Defense",
  "E77": "King's Indian Defense",
  "E78": "King's Indian Defense",
  "E79": "King's Indian Defense",
  "E80": "King's Indian Defense",
  "E81": "King's Indian Defense: Saemisch Variation",
  "E82": "King's Indian Defense",
  "E83": "King's Indian Defense",
  "E84": "King's Indian Defense",
  "E85": "King's Indian Defense",
  "E86": "King's Indian Defense",
  "E87": "King's Indian Defense",
  "E88": "King's Indian Defense",
  "E89": "King's Indian Defense",
  "E90": "King's Indian Defense",
  "E91": "King's Indian Defense",
  "E92": "King's Indian Defense",
  "E93": "King's Indian Defense",
  "E94": "King's Indian Defense",
  "E95": "King's Indian Defense",
  "E96": "King's Indian Defense",
  "E97": "King's Indian Defense",
  "E98": "King's Indian Defense",
  "E99": "King's Indian Defense"
};