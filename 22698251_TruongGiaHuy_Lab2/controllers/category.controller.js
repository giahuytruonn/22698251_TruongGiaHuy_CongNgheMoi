const categoryService = require("../services/category.service");
const { v4: uuidv4 } = require("uuid");

exports.getAll = async (req, res) => {
    const categories = await categoryService.getAll();
    res.render("categories/index", { categories, path: '/categories' });
};

exports.create = async (req, res) => {
    const { name, description } = req.body;
    await categoryService.create({
        categoryId: uuidv4(),
        name,
        description
    });
    res.redirect("/categories");
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    await categoryService.delete(id);
    res.redirect("/categories");
};
