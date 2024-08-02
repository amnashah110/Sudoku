'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const row = coordinate.charAt(0);
      const col = coordinate.charAt(1);
      const regex =  /^[1-9]$/;
      if (!regex.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      if (coordinate.length !== 2 || !/^[a-i]$/i.test(row) || !/^[1-9]$/.test(col)) {
        return res.json({ error: "Invalid coordinate"});
     }
      const valid = solver.validate(puzzle);
      if (valid != 'Valid') {
        return res.json({ error: valid });
      }
      let isValid = true;
      const rowCheck = solver.checkRowPlacement(puzzle, row, col, value);
      const colCheck = solver.checkColPlacement(puzzle, row, col, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, col, value);
      if (rowCheck && colCheck && regionCheck) {
        return res.json({valid: isValid});
      }
      isValid = false;
      let conflictArray = [];
      if (!rowCheck) {
        conflictArray.push("row");
      }
      if (!colCheck) {
        conflictArray.push("column");
      }
      if (!regionCheck) {
        conflictArray.push("region");
      }
      return res.json({valid: isValid, conflict: conflictArray});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const valid = solver.validate(puzzle);
      if (valid != 'Valid') {
        return res.json({ error: valid });
      }
      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      return res.json({solution: solution});
    });
};
