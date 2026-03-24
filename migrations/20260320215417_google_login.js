exports.up = function (knex) {
  return knex.schema.table("users", (table) => {
    table.string("google_id").unique().nullable(); // Untuk menyimpan ID unik dari Google
    table.string("avatar").nullable(); // Untuk foto profil
    table.string("password").nullable().alter(); // Ubah password jadi boleh NULL (karena login Google tidak pakai password)
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", (table) => {
    table.dropColumn("google_id");
    table.dropColumn("avatar");
    table.string("password").notNullable().alter(); // Ubah password jadi boleh NULL (karena login Google tidak pakai password)
  });
};
