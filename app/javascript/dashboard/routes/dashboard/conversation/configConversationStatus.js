/**
 * Configuration for the taskboard
 */


export const taskboardConfig = {
    // Experimental, transition moving cards using the editor
    useDomTransition: true,
  
    features: {
      columnToolbars: false,
      taskEdit : {
        items : {
            // Change label of the description field and move it to the bottom
            description : {
                label : 'Comment',
                weight : 700
            }
        }
    }
    },
    // Columns to display
    columns: ['Agendados', 'Reagendados', 'Remarcados', 'Tratativas'],
  
    // Field used to pair a task to a column
    columnField: 'status',
  
    bodyItems: {
      tags: { type: 'tags' },
    },
  
    // Project using inline data
    project: {
      tasksData: [
        {
          id: 1,
          name: 'John Doe',
          status: 'Agendados',
          prio: 'medium',
        },
        { id: 2, name: 'Vinicius Mendes', status: 'Agendados', description: `- info 1`, prio: 'medium' },
        { id: 3, name: 'Marcio Barbosa', status: 'Reagendados', prio: 'low' },
        { id: 4, name: 'Ana Oliveira', status: 'Reagendados', prio: 'low' },
        { id: 5, name: 'João Pereira', status: 'Remarcados', prio: 'low' },
        { id: 6, name: 'Carlos Souza', status: 'Tratativas', prio: 'low' },
        { id: 7, name: 'Fernanda Santos', status: 'Tratativas', prio: 'low' },
      ],
  
      /* resourcesData: [
        { id: 1, name: 'Angelo' },
        { id: 2, name: 'Celia' },
        { id: 3, name: 'Dave' },
        { id: 4, name: 'Emilia' },
        { id: 5, name: 'Gloria' },
        { id: 6, name: 'Henrik' },
      ], */
  
      assignmentsData: [
        { id: 1, event: 7, resource: 1 },
        { id: 2, event: 7, resource: 2 },
        { id: 3, event: 8, resource: 2 },
      ],
    },
  };
  