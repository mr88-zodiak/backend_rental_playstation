const { Model } = require("objection");

class Product extends Model {
  static get tableName() {
    return "products";
  }
  static get idColumn() {
    return "id";
  }
  static async getProduct(uuid) {
    return await this.query()
      .findOne({ uuid })
      .throwIfNotFound({ message: "Produk tidak ditemukan!" })
      .select("uuid", "name", "description", "price", "status", "image")
      .withGraphFetched("products(selectCustomerName)")
      .modifiers({
        selectCustomerName(builder) {
          builder.select("name", "email");
        },
      });
  }
  static async getAllProducts() {
    return await this.query().select("id", "id_user");
  }
  static async createProduct(data) {
    return this.query().insertAndFetch(data);
  }

  static async updateProduct(uuid, data) {
    const result = await this.query().patch(data).where("uuid", uuid).returning("*").first();

    if (!result) {
      throw new Error("Produk tidak ditemukan!");
    }

    return result;
  }

  static async deleteProduct(uuid) {
    const updatedCount = await this.query()
      .patch({
        deleted_at: new Date().toISOString(),
        status: "inactive",
      })
      .where("uuid", uuid);

    if (updatedCount === 0) {
      throw new Error("Produk tidak ditemukan!");
    }

    return {
      success: true,
      message: `Produk dengan UUID ${uuid} berhasil dinonaktifkan`,
    };
  }
}

module.exports = Product;
