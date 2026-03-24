const { Model } = require("objection");

class Product extends Model {
  static get tableName() {
    return "products";
  }
  static async getProduct(id) {
    return await this.query()
      .findById(id)
      .throwIfNotFound({ message: "Produk tidak ditemukan!" })
      .select("id", "name", "description", "price", "status", "image")
      .withGraphFetched("user(selectCustomerName)")
      .modifiers({
        selectCustomerName(builder) {
          builder.select("name", "email");
        },
      });
  }
}

module.exports = Product;
