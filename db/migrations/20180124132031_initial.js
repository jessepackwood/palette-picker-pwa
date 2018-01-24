
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project-name');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('project-name');
      table.string('palette-name');
      table.string('color-1');
      table.string('color-2');
      table.string('color-3');
      table.string('color-4');
      table.string('color-5');
      table.integer('project_id').unsigned();
      table.foreign('project_id').references('projects.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTabel('projects')
  ])
};
