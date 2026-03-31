/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("users", (table) => {
    table.string("otp_code").nullable();
    table.timestamp("otp_expires_at").nullable();
    table.boolean("is_verified").defaultTo(false);
    table.integer("otp_attempts").defaultTo(0);
    table.timestamp("last_otp_sent_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("users", (table) => {
    table.dropColumn("otp_code");
    table.dropColumn("otp_expires_at");
    table.dropColumn("is_verified");
    table.dropColumn("otp_attempts");
    table.dropColumn("last_otp_sent_at");
  });
};
