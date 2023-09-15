const cellNodeList = document.querySelectorAll(".cell");

export function renderKnight(coords) {
  resetCellNodeListClasses();
  const cells = Array.prototype.slice.call(cellNodeList);
  const index = cells.findIndex((el) => {
    return el.id === coords;
  });

  return cellNodeList[index].classList.add("knight");
}

function resetCellNodeListClasses() {
  cellNodeList.forEach((element) => {
    element.classList.remove("knight");
  });
}
