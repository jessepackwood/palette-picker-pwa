
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
      // Inserts seed entries
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project_name: 'Project 1'
        }, 'id')
        .then(palettes => {
          return knex('palettes').insert([
            {
            project_name: 'Project 1',
            palette_name: 'Palette 1', 
            color1: '#fff', 
            color2: '#fff', 
            color3: '#fff', 
            color4: '#fff', 
            color5: '#fff',
            projects_id: palettes[0]
            }
          ])
        })
        .then( () => console.log('seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) //end Promise.all
    });
};
