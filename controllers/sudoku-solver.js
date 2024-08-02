class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    const regex = /^[0-9.]*$/;
    if (!regex.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }
    return 'Valid';
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowNum = row.charCodeAt(0) - 65;
    const colNum = +column - 1;
    for (let i = rowNum * 9; i < rowNum * 9 + 9; i++) {
      if (puzzleString[i] === value && i !== rowNum * 9 + colNum) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colNum = +column - 1;
    const rowNum = row.charCodeAt(0) - 65;
    for (let i = 0; i < 9; i++) {
      let pos = colNum + i * 9;
      if (puzzleString[pos] === value && pos !== rowNum * 9 + colNum) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const colNum = +column - 1;
    const rowNum = row.charCodeAt(0) - 65;
    const regionHorizontal = Math.floor(colNum / 3);
    const regionVertical = Math.floor(rowNum / 3);
    let startPos = regionVertical * 3 * 9 + regionHorizontal * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let pos = startPos + i * 9 + j;
        if (puzzleString[pos] === value && !(rowNum * 9 + colNum === pos)) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    let puzzle = puzzleString.split('');
    if (!this.validate(puzzle)) {
      return false;
    }
    const solveHelper = () => {
      for (let i = 0; i < 81; i++) {
        if (puzzle[i] === '.') {
          for (let j = 1; j < 10; j++) {
            const col = this.checkColPlacement(puzzle, String.fromCharCode(Math.floor(i / 9) + 65), (i % 9) + 1, j.toString());
            const row = this.checkRowPlacement(puzzle, String.fromCharCode(Math.floor(i / 9) + 65), (i % 9) + 1, j.toString());
            const region = this.checkRegionPlacement(puzzle, String.fromCharCode(Math.floor(i / 9) + 65), (i % 9) + 1, j.toString());
            if (col && row && region) {
              puzzle[i] = j.toString();
              if (solveHelper()) {
                return true;
              }
              puzzle[i] = '.';
            }
          }
          return false;
        }
      }
      return true;
    };
    const solved = solveHelper();
    return solved ? puzzle.join('') : false;
  }
}

module.exports = SudokuSolver;