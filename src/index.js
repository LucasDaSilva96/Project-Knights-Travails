import "./style.css";
import { renderKnight } from "./render-knight.js";

const startDiv = document.querySelector("#start-pos-coord");
const endDiv = document.querySelector("#end-pos-coord");
const modalContent = document.querySelector(".modal");
const modalMsgBox = document.querySelector(".msg-box");
const resetPage = document.querySelector("#resetPos");
const submitPos = document.querySelector("#submitPos");
let startPos = null;
let endPos = null;
let pathMsg;

const cells = document.querySelectorAll(".cell");

// This is for getting the cell that the user clicked on
cells.forEach((el) => {
  el.addEventListener("click", function () {
    if (startPos === null) {
      startPos = splitCellId(el.id);
      renderKnight(el.id);
      startDiv.textContent = `[${startPos}]`;
    } else if (endPos === null) {
      endPos = splitCellId(el.id);
      endDiv.textContent = `[${endPos}]`;
    }
  });
});

// This is for format the id of the clicked cell
function splitCellId(id) {
  const idArray = id.split(",");
  idArray[0] = Number(idArray[0]);
  idArray[1] = Number(idArray[1]);

  return idArray;
}

// This is for reloading the page (reset the program)
function reloadPage() {
  return window.location.reload();
}

// This is for showing the text message modal
function showModal(message) {
  modalMsgBox.textContent = message;
  modalContent.classList.remove("hidden");
}

// This is for hiding the text message modal
function closeModal() {
  modalContent.classList.add("hidden");
  modalMsgBox.textContent = "";
}

// Find knight's path
function findPath() {
  const startPosition = startPos;
  const endPosition = endPos;

  if (startPosition === null || endPosition === null) {
    showModal("Please select start and end position");
    return;
  }

  const message = knightMoves(startPosition, endPosition);

  if (message === null) {
    showModal("No path found");
    return;
  }

  showModal(message);

  // Highlight the squares on the path
  for (let pos of pathMsg) {
    const x = getPath(pos).x;
    const y = getPath(pos).y;

    const square = document.getElementById(`${x},${y}`);
    square.style.border = "solid #000 1px";
    square.style.backgroundColor = "#0080ff";
    renderKnight(`${x},${y}`);
  }
}

// Knight's moves algorithm logic
const createQueue = () => {
  const elements = [];

  const el = () => elements;

  const enqueue = (element) => {
    return elements.push(element);
  };

  const dequeue = () => {
    return elements.shift();
  };

  const isEmpty = () => {
    return elements.length === 0;
  };

  return {
    el,
    enqueue,
    dequeue,
    isEmpty,
  };
};

const knightFactory = (x, y, distance = null, visited = false, prev = null) => {
  return {
    x,
    y,
    distance,
    visited,
    prev,
  };
};

// Create 8x8 chessBoard array
const createGameBoard = () => {
  const chessBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));

  return chessBoard;
};

// This function ensures that the knight can only make moves that are valid within the constraints of the chessboard.
const getLegalMoves = (knightPosX, knightPosY) => {
  let x = knightPosX;
  let y = knightPosY;

  let legalMoves = [
    { x: x + 2, y: y + 1 },
    { x: x + 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x + 1, y: y - 2 },
  ];

  legalMoves = legalMoves.filter(
    (move) => move.x >= 0 && move.x <= 7 && move.y >= 0 && move.y <= 7
  );

  return legalMoves;
};

// function that implements the logic to find the shortest path that a knight can take from a given starting position to an ending position on a chessboard.
const knightMoves = (startPos, endPos) => {
  const visited = new Set();

  const startingX = startPos[0];
  const startingY = startPos[1];

  let startingKnight = knightFactory(startingX, startingY, 0, true, null);
  visited.add(`${startingX}, ${startingY}`);

  const queue = createQueue();
  queue.enqueue(startingKnight);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();

    if (current.x === endPos[0] && current.y === endPos[1]) {
      const path = [];
      let node = current;
      while (node !== null) {
        path.unshift([node.x, node.y]);
        node = node.prev;
      }

      pathMsg = [path[0]];
      for (let i = 1; i < path.length; i++) {
        pathMsg[i] = `[${path[i]}]`;
      }
      pathMsg[0] = `[${pathMsg[0]}]`;
      const distance = path.length;
      const message = `Amount of moves: ${distance},\nYour path: ${pathMsg}`;
      return message;
    } else {
      const checkLegalMoves = getLegalMoves(current.x, current.y);

      for (let move of checkLegalMoves) {
        const newKnight = knightFactory(
          move.x,
          move.y,
          current.distance + 1,
          true
        );

        const newPostKey = `${move.x}, ${move.y}`;
        if (!visited.has(newPostKey)) {
          visited.add(newPostKey);
          newKnight.prev = current;
          queue.enqueue(newKnight);
        }
      }
    }
  }
  return null;
};

// Get the x and y from the cell-id
function getPath(arr) {
  let x, y;

  x = arr[1];
  y = arr[3];

  return {
    x,
    y,
  };
}

createGameBoard();
// Event listeners
submitPos.addEventListener("click", findPath);
resetPage.addEventListener("click", reloadPage);
modalContent.addEventListener("click", closeModal);
