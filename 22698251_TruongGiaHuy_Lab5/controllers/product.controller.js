const { v4: uuidv4 } = require("uuid");
const productRepository = require("../repositories/product.repository");

const list = async (req, res) => {
  const products = await productRepository.list();
  res.render("products/index", { products });
};

const showCreate = (req, res) => {
  res.render("products/create");
};

const create = async (req, res) => {
  const { name, price, url_image } = req.body;
  const uploadedImage = req.file ? `/assest/uploads/${req.file.filename}` : "";
  const parsedPrice = Number(price);
  const product = {
    id: uuidv4(),
    name: (name || "").trim(),
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    url_image: uploadedImage || (url_image || "").trim()
  };
  await productRepository.create(product);
  res.redirect("/products");
};

const showEdit = async (req, res) => {
  const product = await productRepository.findById(req.params.id);
  if (!product) {
    return res.redirect("/products");
  }
  res.render("products/edit", { product });
};

const update = async (req, res) => {
  const { name, price, url_image } = req.body;
  const uploadedImage = req.file ? `/assest/uploads/${req.file.filename}` : "";
  const parsedPrice = Number(price);
  const existing = await productRepository.findById(req.params.id);
  if (!existing) {
    return res.redirect("/products");
  }
  await productRepository.update(req.params.id, {
    name: (name || "").trim(),
    price: Number.isFinite(parsedPrice) ? parsedPrice : existing.price || 0,
    url_image: uploadedImage || (url_image || existing.url_image || "").trim()
  });
  res.redirect("/products");
};

const remove = async (req, res) => {
  await productRepository.remove(req.params.id);
  res.redirect("/products");
};

module.exports = {
  list,
  showCreate,
  create,
  showEdit,
  update,
  remove
};

