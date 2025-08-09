const express = require('express');
const app = express();

const persons = require('./data/persons.json');

// GET /api/person/:identifier
app.get('/api/person/:identifier', (req, res) => {
  const { identifier } = req.params;
  const person = persons.find(
    p => p.identifier === identifier
  );

  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }

  res.json(person);
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
