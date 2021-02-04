const ndb = require("../../databasePool");

const getProducts = (req, res) => {
    const db = ndb();
    db.query(
      "SELECT *, products.id AS product_id, products.name_en AS product_name_en, products.name_fr AS product_name_fr, products_category.name_en AS category_name_en, products_category.name_fr AS category_name_fr, products_category.id AS category FROM products LEFT JOIN products_category ON products.category_id= products_category.id",
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
    db.end();
}

const updateProductById = (req, res) => {
  const id = req.params.id;
  const {
    name_en, name_fr, category_id, image_name, active
  } = req.body;

  let product = {
    name_en, name_fr, category_id, image_name, active
  };

  const db = ndb();
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
  db.end();
}

const deleteProduct = (req, res) => {
  const id = req.params.id;
  const db = ndb();
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
  db.end();
}

const productById = (req, res) => {
  const id = req.params.id;

  const db = ndb();
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
  db.end();
}

const categories = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT * FROM products_category",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
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

  const db = ndb();
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
  db.end();
};

const packagingByProductId = (req, res) => {
  const id = req.params.id;
  const db = ndb();
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
  db.end();
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

  const db = ndb();
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
  db.end();
};

const updateCategoryById = (req, res) => {
  const id = req.params.id;
  const {
    name_en, name_fr, slug
  } = req.body;

  let product = {
    name_en, name_fr, slug
  };

  const db = ndb();
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
  db.end();
}

const deleteCategory = (req, res) => {
  const id = req.params.id;
  const db = ndb();
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
  db.end();
}

const categoryById = (req, res) => {
  const id = req.params.id;

  const db = ndb();
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
  db.end();
}

const getProductDetails = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT *, products.name_en AS name_en, products.name_fr AS name_fr, products_details.id AS product_details_id, products_category.name_en AS category_name_en, products_category.name_fr AS category_name_fr FROM products LEFT JOIN products_details ON products_details.product_id = products.id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id LEFT JOIN products_category ON products_category.id = products.category_id",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

module.exports = {
  getProducts,
  getProductDetails,
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
