async function getPlayerInfo() {
  const nameInput = document.getElementById('playerInput').value.trim();
  const apiKey = '2c6af3eb-a6ce-48b9-9b8d-3d80b58f3f3b';

  if (!nameInput) {
    alert("Please enter a player name.");
    return;
  }

  try {
    // Step 1: Search Player by Name
    const searchRes = await fetch(`https://api.cricapi.com/v1/players?apikey=${apiKey}&search=${nameInput}`);
    const searchData = await searchRes.json();

    if (!searchData.data || searchData.data.length === 0) {
      alert("Player not found.");
      return;
    }

    const playerId = searchData.data[0].id;

    // Step 2: Get Player Full Info
    const infoRes = await fetch(`https://api.cricapi.com/v1/players_info?apikey=${apiKey}&id=${playerId}`);
    const infoData = await infoRes.json();
    const data = infoData.data;

    // Populate profile
    document.getElementById('playerName').textContent = data.name;
    document.getElementById('dob').textContent = data.dateOfBirth?.split("T")[0] || "-";
    document.getElementById('country').textContent = data.country || "-";
    document.getElementById('role').textContent = data.role || "-";
    document.getElementById('batting').textContent = data.battingStyle || "-";
    document.getElementById('bowling').textContent = data.bowlingStyle || "-";
    document.getElementById('playerImg').src = data.playerImg || "https://via.placeholder.com/100";

    document.getElementById('playerCard').classList.remove('hidden');

    // Process stats
    const stats = data.stats;
    const batting = {};
    const bowling = {};

    stats.forEach(stat => {
      const container = stat.fn === "batting" ? batting : bowling;
      if (!container[stat.matchtype]) {
        container[stat.matchtype] = {};
      }
      container[stat.matchtype][stat.stat.trim()] = stat.value.trim();
    });

    // Render Batting
    let battingHTML = "<h4>Batting</h4>";
    for (const format in batting) {
      battingHTML += `<h5>${format.toUpperCase()}</h5><ul>`;
      for (const key in batting[format]) {
        battingHTML += `<li><strong>${key}:</strong> ${batting[format][key]}</li>`;
      }
      battingHTML += "</ul>";
    }
    document.getElementById('battingStats').innerHTML = battingHTML;

    // Render Bowling
    let bowlingHTML = "<h4>Bowling</h4>";
    for (const format in bowling) {
      bowlingHTML += `<h5>${format.toUpperCase()}</h5><ul>`;
      for (const key in bowling[format]) {
        bowlingHTML += `<li><strong>${key}:</strong> ${bowling[format][key]}</li>`;
      }
      bowlingHTML += "</ul>";
    }
    document.getElementById('bowlingStats').innerHTML = bowlingHTML;

    document.getElementById('statsContainer').classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }
}
