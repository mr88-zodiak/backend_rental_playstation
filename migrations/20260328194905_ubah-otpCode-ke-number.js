/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // Kita langsung eksekusi SQL murni agar Knex tidak salah generate query
  return knex.raw(`
    ALTER TABLE users 
    ALTER COLUMN otp_code TYPE INTEGER 
    USING otp_code::integer
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE users 
    ALTER COLUMN otp_code TYPE VARCHAR(255)
  `);
};
