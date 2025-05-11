let colorNames = ["red", "yellow", "blue", "green", "purple", "orange"];
let colorCodes = [
  "#FF0000",
  "#FFFF00",
  "#0000FF",
  "#008000",
  "#800080",
  "#FFA500",
];

export const selectColors = () => {
  // Create local copies to avoid mutating global arrays
  let namesCopy = [...colorNames];
  let codesCopy = [...colorCodes];

  let selectedColors = [];
  let selectedCodes = [];
  let selectedObj = [];

  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * namesCopy.length);
    selectedColors.push(namesCopy[index]);
    selectedCodes.push(codesCopy[index]);

    selectedObj.push({ name: namesCopy[index], code: codesCopy[index] });

    // Remove selected items using splice to maintain correct indexing
    namesCopy.splice(index, 1);
    codesCopy.splice(index, 1);
  }

  let shuffledObj = [];
  let codesToShuffle = [...selectedCodes]; // Separate copy for shuffling

  for (let i = 0; i < selectedColors.length; i++) {
    const index = Math.floor(Math.random() * codesToShuffle.length);
    shuffledObj.push({
      name: selectedColors[i],
      code: codesToShuffle[index],
    });
    codesToShuffle.splice(index, 1);
  }

  const randomColorName =
    shuffledObj[Math.floor(Math.random() * shuffledObj.length)].name;

  return { shuffledObj, randomColorName };
};
