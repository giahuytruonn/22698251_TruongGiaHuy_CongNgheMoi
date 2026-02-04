const categoryRepository = require("../repositories/category.repository");

class CategoryService {
    async getAll() {
        return await categoryRepository.findAll();
    }

    async create(data) {
        return await categoryRepository.create(data);
    }

    async delete(id) {
        return await categoryRepository.delete({ categoryId: id });
    }
}

module.exports = new CategoryService();
