/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();

    // 1. Buat kolom id_user sebagai unsigned integer
    table.integer("id_user").unsigned().notNullable();
    // 2. Hubungkan sebagai foreign key ke tabel users
    table.foreign("id_user").references("id").inTable("users").onDelete("CASCADE");

    table.string("name").notNullable();
    table.text("description").notNullable(); // Gunakan .text() jika deskripsi panjang
    table.decimal("price", 14, 2).notNullable(); // Format uang (total digit, digit di belakang koma)
    table.string("image").notNullable();
    table.string("status").nullable(); // Contoh: 'available', 'out_of_stock'
    table.integer("stock").defaultTo(0); // Gunakan integer untuk jumlah barang

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
