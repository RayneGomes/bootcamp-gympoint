module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Start',
          duration: 1,
          price: 129,
        },
        {
          title: 'Gold',
          duration: 3,
          price: 109,
        },
        {
          title: 'Diamond',
          duration: 6,
          price: 89,
        },
      ],
      {}
    );
  },

  down: () => {},
};
