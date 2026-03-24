exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("role").defaultTo("buyer").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("role").alter();
  });
};
