const BaseRepository = require("./base.repository");

class CategoryRepository extends BaseRepository {
    constructor() {
        super(process.env.TABLE_CATEGORIES);
    }
}

module.exports = new CategoryRepository();
