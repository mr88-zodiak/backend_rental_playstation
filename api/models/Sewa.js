const { Model } = require("objection");

class Sewa extends Model {
  static get tableName() {
    return "Sewa";
  }

  static async getSewa(id) {
    return await this.query().where({ id }).first();
  }
  static async getSewaByUser(id) {
    return await this.query().where({ id_user: id }).first();
  }
  static async getSewaByProduct(id) {
    return await this.query().where({ id_product: id }).first();
  }
  static async getSewaByStatus(status) {
    return await this.query().where({ status }).first();
  }
  static async getSewaByStatusAndUser(status, id) {
    return await this.query().where({ status, id_user: id }).first();
  }
  static async sewa(id_user, id_product, data) {
    const Product = require("./Product");

    // Gunakan Transaction agar jika satu gagal, semua batal (Rollback)
    const trx = await this.startTransaction();

    try {
      // 1. Cek apakah produk tersedia
      const product = await Product.query(trx).findById(id_product);
      if (!product || product.status !== "available" || product.stock <= 0) {
        throw new Error("Produk tidak tersedia untuk disewa!");
      }

      // 2. Buat data sewa
      const newSewa = await this.query(trx).insert({
        id_user,
        id_product,
        order_id: `SRV-${Date.now()}`,
        status: "pending",
        ...data,
      });
      await Product.query(trx).patchAndFetchById(id_product, {
        stock: product.stock - 1,
        status: product.stock - 1 === 0 ? "Disewa" : "Tersedia",
      });

      await trx.commit();
      return newSewa;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

module.exports = Sewa;
