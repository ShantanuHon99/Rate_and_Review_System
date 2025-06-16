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
