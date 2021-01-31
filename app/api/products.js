const db = require("../../databasePool");

const getProducts = (req, res) => {
    db.query(
      "SELECT *, products.id AS product_id, products.name_en AS product_name_en, products.name_fr AS product_name_fr, products_category.name_en AS category_name_en, products_category.name_fr AS category_name_fr, products_category.id AS category FROM products LEFT JOIN products_category ON products.category_id= products_category.id",
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
}

const updateProductById = (req, res) => {
  const id = req.params.id;
  const {
    name_en, name_fr, category_id, image_name, active
  } = req.body;

  let product = {
    name_en, name_fr, category_id, image_name, active
  };

  db.query(
    "UPDATE products SET ? WHERE id = ?",
    [product, id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const deleteProduct = (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM products WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const productById = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT name_en, name_fr, category_id, active, image_name FROM products WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const categories = (req, res) => {
  db.query(
    "SELECT * FROM products_category",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const createProduct = (req, res) => {
  const {
    name_en,
    name_fr,
    category_id,
    image_name,
    active
   } = req.body;

  const entry = {
      name_en,
      name_fr,
      category_id,
      image_name,
      active
  };

  db.query(
    "INSERT INTO products SET ?",
    entry,
    (error, result) => {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          console.log(result);
          res.send(result);
        }
    }
  );
};

const packagingByProductId = (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT *, products_details.id AS details_id, product_packaging.id AS package_id FROM products_details LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE products_details.product_id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const createCategory = (req, res) => {
  const {
    name_en,
    name_fr,
    slug
   } = req.body;

  const entry = {
      name_en,
      name_fr,
      slug
  };

  db.query(
    "INSERT INTO products_category SET ?",
    entry,
    (error, result) => {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          console.log(result);
          res.send(result);
        }
    }
  );
};

const updateCategoryById = (req, res) => {
  const id = req.params.id;
  const {
    name_en, name_fr, slug
  } = req.body;

  let product = {
    name_en, name_fr, slug
  };

  db.query(
    "UPDATE products_category SET ? WHERE id = ?",
    [product, id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const deleteCategory = (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM products_category WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const categoryById = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT name_en, name_fr, slug FROM products_category WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

module.exports = {
  getProducts,
  updateProductById,
  deleteProduct,
  productById,
  categories,
  createProduct,
  packagingByProductId,
  createCategory,
  updateCategoryById,
  deleteCategory,
  categoryById
};
