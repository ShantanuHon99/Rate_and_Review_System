const db = require('../db/db');

exports.addReview = async (req, res) => {
  const { username, product_id, rating, review_text } = req.body;
  const photo_url = req.file ? req.file.filename : null;

  if (!username || !product_id || (!rating && !review_text)) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    // Check if user exists, else create
    let [[user]] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
    if (!user) {
      const [result] = await db.query(`INSERT INTO users (username) VALUES (?)`, [username]);
      user = { id: result.insertId };
    }
    if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1.0 and 5.0' });
    }


    // Check if user already reviewed the product
    const [existing] = await db.query(
      `SELECT * FROM reviews WHERE user_id = ? AND product_id = ?`,
      [user.id, product_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already reviewed this product' });
    }

    // Insert review
    await db.query(
      `INSERT INTO reviews (user_id, product_id, rating, review_text, photo_url) VALUES (?, ?, ?, ?, ?)`,
      [user.id, product_id, rating || null, review_text || null, photo_url]
    );

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

const stopwords = new Set([
  'the', 'is', 'a', 'an', 'this', 'that', 'and', 'for', 'it', 'to', 'of', 'was', 'in', 'on', 'i', 'you', 'with', 'my'
]);

exports.getPopularTags = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT review_text FROM reviews');
    const wordFreq = {};

    rows.forEach(row => {
      const words = row.review_text
        ?.toLowerCase()
        .replace(/[^\w\s]/g, '')  // Remove punctuation
        .split(/\s+/) || [];

      words.forEach(word => {
        if (!stopwords.has(word) && word.length > 2) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
    });

    const topTags = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    res.json({ tags: topTags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to extract tags' });
  }
};
