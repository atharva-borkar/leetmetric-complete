const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`LeetMetric backend running on port ${PORT}`);
});

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

const LEETCODE_QUERY = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      userAvatar
      ranking
      realName
    }
    languageProblemCount {
      languageName
      problemsSolved
    }
    tagProblemCounts {
      advanced {
        tagName
        tagSlug
        problemsSolved
      }
    }
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
  allQuestionsCount {
    difficulty
    count
  }
}`;

// Store user data for leaderboard
async function storeUserData(userData) {
  try {
    const filename = path.join(DATA_DIR, 'users.json');
    let users = [];
    
    try {
      const data = await fs.readFile(filename, 'utf-8');
      users = JSON.parse(data);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    const existingIndex = users.findIndex(u => u.username === userData.username);
    const userEntry = {
      username: userData.username,
      totalSolved: userData.totalSolved,
      ranking: userData.ranking,
      avatar: userData.avatar,
      lastUpdated: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      users[existingIndex] = userEntry;
    } else {
      users.push(userEntry);
    }
    
    // Keep only top 100 users
    users.sort((a, b) => b.totalSolved - a.totalSolved);
    users = users.slice(0, 100);
    
    await fs.writeFile(filename, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
}

// Get LeetCode user data
app.post('/api/leetcode', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; LeetMetric/2.0)',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
      },
      body: JSON.stringify({ 
        query: LEETCODE_QUERY, 
        variables: { username } 
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data?.matchedUser) {
      return res.status(404).json({ error: "User not found on LeetCode" });
    }

    // Calculate total solved problems
    const acStats = data.data.matchedUser.submitStats.acSubmissionNum;
    const totalSolved = acStats.find(s => s.difficulty === "All")?.count || 0;
    
    // Store for leaderboard
    await storeUserData({
      username: data.data.matchedUser.username,
      totalSolved,
      ranking: data.data.matchedUser.profile.ranking,
      avatar: data.data.matchedUser.profile.userAvatar
    });

    res.json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: "Failed to fetch data from LeetCode",
      details: error.message 
    });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const filename = path.join(DATA_DIR, 'users.json');
    const data = await fs.readFile(filename, 'utf-8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    res.json([]);
  }
});

// Compare users
app.post('/api/compare', async (req, res) => {
  const { user1, user2 } = req.body;
  
  if (!user1 || !user2) {
    return res.status(400).json({ error: "Two usernames required" });
  }

  try {
    // Fetch both users
    const [response1, response2] = await Promise.all([
      fetch('https://leetcode.com/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; LeetMetric/2.0)',
        },
        body: JSON.stringify({ 
          query: LEETCODE_QUERY, 
          variables: { username: user1 } 
        }),
      }),
      fetch('https://leetcode.com/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; LeetMetric/2.0)',
        },
        body: JSON.stringify({ 
          query: LEETCODE_QUERY, 
          variables: { username: user2 } 
        }),
      })
    ]);

    const [data1, data2] = await Promise.all([
      response1.json(),
      response2.json()
    ]);

    if (!data1.data?.matchedUser || !data2.data?.matchedUser) {
      return res.status(404).json({ error: "One or both users not found" });
    }

    res.json({
      user1: data1.data,
      user2: data2.data,
      allQuestionsCount: data1.data.allQuestionsCount
    });

  } catch (error) {
    res.status(500).json({ error: "Comparison failed", details: error.message });
  }
});

// Initialize and start server
ensureDataDir().then(() => {
  app.listen(PORT, () => {
    console.log(`LeetMetric backend running on http://localhost:${PORT}`);
  });
});
