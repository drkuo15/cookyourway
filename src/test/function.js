export function updateStepMinuteValue(newMinute, steps, index) {
  const newSteps = [...steps];
  newSteps[index].stepMinute = newMinute;
  if (Number(newSteps[index].stepMinute) < 0) {
    newSteps[index].stepMinute = 0;
  }
  if (Number(newSteps[index].stepMinute) > 800) {
    newSteps[index].stepMinute = 800;
  }
  if (Number(newSteps[index].stepMinute) % 1 !== 0) {
    newSteps[index].stepMinute = Math.floor(newMinute);
  }
  newSteps[index].stepTime = Number(newSteps[index].stepMinute) * 60
    + Number(newSteps[index].stepSecond);
  return newSteps;
}

export function parseStepsTime(steps) {
  const parsedSteps = [...steps];
  parsedSteps.forEach((stepObject) => {
    const stepObjTemp = stepObject;
    stepObjTemp.stepMinute = Number(stepObjTemp.stepMinute);
    stepObjTemp.stepSecond = Number(stepObjTemp.stepSecond);
    stepObjTemp.stepTime = Number(stepObjTemp.stepTime);
  });
  return parsedSteps;
}
