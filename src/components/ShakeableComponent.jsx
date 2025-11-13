function ShakeableComponent() {
  const shakeInput = async function (element) {
    element.style.position = "relative";
    let positions = [-10, 20, -20, 20, -20, 20];
    let shakeID = 0;
    let index = 0;

    let shake = function () {
      element.style.left = positions[index] + "px";
      index++;
      if (index >= positions.length) {
        clearInterval(shakeID);
        element.style.left = 0;
      }
    };
    let shakeSpeed = 20;
    shakeID = setInterval(() => shake(index), shakeSpeed);
  };
}

export default ShakeableComponent;
