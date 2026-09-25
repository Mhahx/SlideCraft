// Theme configs for the two directions (deck-plan.md section 2).
// Colours and fonts as decided there. All hex without '#', pptxgenjs convention.

const directionA = {
  id: 'A',
  name: 'Thermoinstrument',
  titleFont: 'Arial',
  bodyFont: 'Arial',
  ground: '241C16',    // warm anthracite, not navy, not green
  text: 'E8E1D8',
  accent: 'D97B3E',    // amber - the one focus colour
  negative: 'C0442B',  // heat / burden (large text & graphics only, 3.3:1 on ground)
  positive: '3B6E8C',  // cooling / benefit (large text & graphics only, 3.0:1 on ground)
  neutral: '857F75',   // de-emphasised bars, 4.2:1 on ground
};

const directionB = {
  id: 'B',
  name: 'Bauamt/Lineatur',
  titleFont: 'Cambria',
  bodyFont: 'Arial',
  ground: 'ECEBE8',    // pale desaturated paper, not cream
  text: '1F2A33',
  accent: 'B5651D',    // ochre/rust (large text & graphics only, 3.6:1 on paper)
  negative: '9E3B26',
  positive: '27506B',
  neutral: '726F69',   // 4.2:1 on paper
};

module.exports = { directionA, directionB };
