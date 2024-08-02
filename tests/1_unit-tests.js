const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let completePuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
    test('Valid Puzzle', function() {
        assert.equal(solver.validate(validPuzzle), 'Valid');
    });
    test('Invalid Characters', function() {
        let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1.A..8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.validate(invalidPuzzle), "Invalid characters in puzzle");
    });
    test('Invalid Length', function() {
        let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1...8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.validate(invalidPuzzle), "Expected puzzle to be 81 characters long");
    });
    test('Valid Row Placement', function() {
        assert.isOk(solver.checkRowPlacement(validPuzzle, 'A', '2', '3'));
    });
    test('Invalid Row Placement', function() {
        assert.isNotOk(solver.checkRowPlacement(validPuzzle, 'A', '2', '2'));
    });
    test('Valid Column Placement', function() {
        assert.isOk(solver.checkColPlacement(validPuzzle, 'G', '7', '4'));
    });
    test('Invalid Column Placement', function() {
        assert.isNotOk(solver.checkColPlacement(validPuzzle, 'D', '4', '3'));
    });
    test('Valid Region Placement', function() {
        assert.isOk(solver.checkRegionPlacement(validPuzzle, 'E', '2', '5'));
    });
    test('Invalid Region Placement', function() {
        assert.isNotOk(solver.checkRegionPlacement(validPuzzle, 'C', '1', '6'));
    });
    test('Valid Puzzle Solved', function() {
        assert.isOk(solver.solve(validPuzzle));
    });
    test('Invalid Puzzle Failed', function() {
        let invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1...8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.isNotOk(solver.solve(invalidPuzzle));
    });
    test('Incomplete Valid Puzzle Solved', function() {
        assert.equal(solver.solve(validPuzzle), completePuzzle);
    });
});
