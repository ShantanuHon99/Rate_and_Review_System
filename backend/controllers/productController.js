const db = require('../db/db');

// Get all products with average rating
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, 
        ROUND(AVG(r.rating), 1) AS avg_rating, 
        COUNT(r.id) AS review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product with all reviews
exports.getProductDetails = async (req, res) => {
  const productId = req.params.id;
  try {
    const [[product]] = await db.query(`SELECT * FROM products WHERE id = ?`, [productId]);
    const [reviews] = await db.query(
      `SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?`,
      [productId]
    );
    res.json({ product, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};
