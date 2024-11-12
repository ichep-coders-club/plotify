// Define the Parameters
function Parameter(name, labels, values, defaultIndex = 0) {
    this.name = name;
    this.labels = labels;
    this.values = values;
    this.selectedIndex = defaultIndex;
}

// Define all necessary parameters
const Section = new Parameter('Section', ["PCS", "Upstream", "Downstream"], ["A00", "A01", "A02"]);
const Analyser = new Parameter('Analyser', ["IVal ~ Mu mass", "IVal"], ["IValidationAnalyzer_selector", "IValidationAnalyzer"]);
const IniFin = new Parameter('StartOrEnd', ["Start", "End"], ["Ini", "Fin"]);
const Stat = new Parameter('Stat', [
    "Total Momentum", "Momentum X", "Momentum Y", "Momentum Z", "Position X", 
    "Position Y", "Position Z", "Position in 2D (XZ)", "Position in 2D (ZY)", 
    "Position in 2D (XY)", "Time", "Phi Angular Trajectory", "Theta Angular Trajectory"
], [
    "TotMomentum", "MomentumX", "MomentumY", "MomentumZ", "PositionX", 
    "PositionY", "PositionZ", "Position2D_XZ", "Position2D_ZY", 
    "Position2D_XY", "Time", "Phi", "Theta"
]);
const Particle = new Parameter('Particle', [
    "All", "Electron", "Positron", "Muon+", "Muon-", "Pion-", "Pion+", "Pion0", 
    "Neutron", "Proton", "Kaon-", "Kaon+", "Gamma", "K_L0", "K_S0", "Sigma-", 
    "Sigma0", "Sigma+", "Lambda0", "Alpha", "Deuteron", "Triton"
], [
    "Combined", "11", "-11", "-13", "13", "-211", "211", "111", "2112", "2212", 
    "-321", "321", "22", "130", "310", "3112", "3212", "3222", "3122", 
    "1000020040", "1000010020", "1000010030"
]);

// List of image names
var image_name_list = ["MC6", "MC7", "m0_compared_MC6vsMC7", "m1_compared_MC6vsMC7", "log_compared_MC6vsMC7", "normal_compared_MC6vsMC7"];

// Define the image filename generator
function generateImageFilename(image_name) {
    return `G4Trajectories_${Analyser.values[Analyser.selectedIndex]}/h${IniFin.values[IniFin.selectedIndex]}${Stat.values[Stat.selectedIndex]}/h${IniFin.values[IniFin.selectedIndex]}${Stat.values[Stat.selectedIndex]}_${Particle.values[Particle.selectedIndex]}_${image_name}${Section.values[Section.selectedIndex]}.png`;
}

// Array of all parameters
const parameters = [Section, Analyser, IniFin, Stat, Particle];


// Control the number of columns in which figures appear.
// 'Image_name_list' will be divided across these columns from left to right, top to bottom.
// ```
//   i.e.var image_name_list = [a,b,c,d]
//   let numColumns = 2
// ```
// Will show figures in this pattern on the page:
// | a   b  |
// | c   d  |
let numColumns = 2;




