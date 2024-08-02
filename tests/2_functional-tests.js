const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let completePuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Functional Tests', () => {
    test('Solve with Valid Puzzle', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: validPuzzle,
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, completePuzzle);
                done();
            });
    });
    test('Solve with Missing Puzzle', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({
                
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });
    test('Solve with Invalid Characters', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1.A..8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });
    test('Solve With Incorrect Length', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '1.5..2.84..63.12...8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('Puzzle Cannot Be Solved', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });
    test('All Placement Fields', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: '3'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true);
                done();
            });
    });
    test('Single Placement Conflict', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: '4'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "valid": false, "conflict": [ "row" ] });
                done();
            });
    });
    test('Multiple Placement Conflicts', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B2',
                value: '7'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column" ] });
                done();
            });
    });
    test('All Placement Conflicts', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: '2'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column", "region" ] });
                done();
            });
    });
    test('Check With Missing Required Fields', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });
    test('Check with Invalid Characters', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1.A..8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });
    test('Check With Incorrect Length', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12...8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('Check With Invalid Placement Coordinate', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'P2',
                value: '2'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            });
    });
    test('Check With Invalid Placement Value', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: 'P'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });
});

