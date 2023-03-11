export const playerDisplaySettingsLogic = (width, height, players) => {
  const playerLocations = [];
  const ratio = (width < height ? width : height) / 1250;
  const zoomFactor = ratio * 100;
  playerLocations.push({
    x: width / 2,
    y: height - 10 - (125 * ratio),
    zoom: zoomFactor,
    rotation: 0,
  });
  if (players === 3) {
    playerLocations.push({
      x: 320 * ratio,
      y: 320 * ratio,
      zoom: zoomFactor,
      rotation: 135,
    });
    playerLocations.push({
      x: width - (320 * ratio),
      y: 320 * ratio,
      zoom: zoomFactor,
      rotation: 225,
    });
  }
  if (players === 4) {
    playerLocations.push({
      x: 10 + (125 * ratio),
      y: height / 2,
      zoom: zoomFactor,
      rotation: 90,
    });
    playerLocations.push({
      x: width / 2,
      y: 10 + (125 * ratio),
      zoom: zoomFactor,
      rotation: 180,
    });
    playerLocations.push({
      x: width - 10 - (125 * ratio),
      y: height / 2,
      zoom: zoomFactor,
      rotation: 270,
    });
  }
  return playerLocations;
};
