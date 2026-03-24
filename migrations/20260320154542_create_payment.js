exports.up = function (knex) {
  return knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();
    table.integer("sewa_id").unsigned().references("id").inTable("sewa").onDelete("CASCADE");

    table.string("transaction_id");
    table.string("method");
    table.decimal("amount", 14, 2);
    table.string("status");
    table.jsonb("raw_gateway_response");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("payments");
};
