// var table = document.querySelectorAll('.wikitable');
// var tableRows = [...table[1].querySelectorAll('tr')];
// var data = tableRows.map(row => row.innerText);
// copy(data);

var season1 = [
    ["1", "1", "Mole Hunt", "Adam Reed", "September 17, 2009", "AR01001", "0.91[6]"],
    ["2", "2", "Training Day", "Adam Reed", "January 14, 2010", "XAR01002", "1.82[6]"],
    ["3", "3", "Diversity Hire", "Adam Reed", "January 21, 2010", "XAR01004", "1.23[6]"],
    ["4", "4", "Killing Utne", "Adam Reed", "January 28, 2010", "XAR01003", "0.87[6]"],
    ["5", "5", "Honeypot", "Adam Reed & Tony Carbone", "February 4, 2010", "XAR01005", "0.62[6]"],
    ["6", "6", "Skorpio", "Adam Reed", "February 11, 2010", "XAR01006", "0.76[6]"],
    ["7", "7", "Skytanic", "Adam Reed", "February 18, 2010", "XAR01007", "0.87[6]"],
    ["8", "8", "The Rock", "Adam Reed & Boswell Cocker", "March 4, 2010", "XAR01008", "0.72[6]"],
    ["9", "9", "Job Offer", "Adam Reed", "March 11, 2010", "XAR01009", "1.08[6]"],
    ["10", "10", "Dial M for Mother", "Adam Reed", "March 18, 2010", "XAR01010", "0.76[6]"]
];

var season2 = [
    ["11", "1", "Swiss Miss", "Story by : Mehar Sethi Teleplay by : Adam Reed", "January 27, 2011", "XAR02002", "1.53[7]"],
    ["12", "2", "A Going Concern", "Adam Reed", "February 3, 2011", "XAR02006", "1.11[8]"],
    ["13", "3", "Blood Test", "Adam Reed", "February 10, 2011", "XAR02001", "1.12[9]"],
    ["14", "4", "Pipeline Fever", "Story by : Boswell Cocker Teleplay by : Adam Reed", "February 17, 2011", "XAR02007", "0.99[10]"],
    ["15", "5", "The Double Deuce", "Adam Reed", "February 24, 2011", "XAR02004", "1.00[11]"],
    ["16", "6", "Tragical History", "Adam Reed", "March 3, 2011", "XAR02005", "1.02[12]"],
    ["17", "7", "Movie Star", "Adam Reed", "March 10, 2011", "XAR02003", "1.02[13]"],
    ["18", "8", "Stage Two", "Adam Reed", "March 17, 2011", "XAR02008", "0.93[14]"],
    ["19", "9", "Placebo Effect", "Adam Reed", "March 24, 2011", "XAR02009", "1.09[15]"],
    ["20", "10", "El Secuestro", "Adam Reed", "March 31, 2011", "XAR02010", "1.32[16]"],
    ["21", "11", "Jeu Monégasque", "Adam Reed", "April 7, 2011", "XAR02011", "1.01[17]"],
    ["22", "12", "White Nights", "Adam Reed", "April 14, 2011", "XAR02012", "1.21[18]"],
    ["23", "13", "Double Trouble", "Adam Reed", "April 21, 2011", "XAR02013", "1.01[19]"]
];

var season3 = [
    ["24", "1", "Heart of Archness: Part I", "Adam Reed", "September 15, 2011", "XAR03001", "1.17[20]"],
    ["25", "2", "Heart of Archness: Part II", "Adam Reed", "September 22, 2011", "XAR03002", "1.10[21]"],
    ["26", "3", "Heart of Archness: Part III", "Adam Reed", "September 29, 2011", "XAR03003", "1.19[22]"],
    ["27", "4", "The Man from Jupiter", "Adam Reed", "January 19, 2012", "XAR03005", "1.31[23]"],
    ["28", "5", "El Contador", "Story by : Tesha Kondrat Teleplay by : Adam Reed", "January 26, 2012", "XAR03006", "1.12[24]"],
    ["29", "6", "The Limited", "Adam Reed", "February 2, 2012", "XAR03007", "1.06[25]"],
    ["30", "7", "Drift Problem", "Adam Reed", "February 9, 2012", "XAR03008", "1.22[26]"],
    ["31", "8", "Lo Scandalo", "Adam Reed", "February 16, 2012", "XAR03004", "1.20[27]"],
    ["32", "9", "Bloody Ferlin", "Adam Reed", "February 23, 2012", "XAR03010", "1.27[28]"],
    ["33", "10", "Crossing Over", "Adam Reed", "March 1, 2012", "XAR03009", "1.07[29]"],
    ["34", "11", "Skin Game", "Chris Provenzano & Adam Reed", "March 8, 2012", "XAR03011", "1.04[30]"],
    ["35", "12", "Space Race: Part I", "Adam Reed", "March 15, 2012", "XAR03012", "1.16[31]"],
    ["36", "13", "Space Race: Part II", "Adam Reed", "March 22, 2012", "XAR03013", "1.33[32]"]
];

var season4 = [
    ["37", "1", "Fugue and Riffs", "Adam Reed", "January 17, 2013", "XAR04001", "1.61[33]"],
    ["38", "2", "The Wind Cries Mary", "Adam Reed & Chris Provenzano", "January 24, 2013", "XAR04003", "1.58[34]"],
    ["39", "3", "Legs", "Adam Reed", "January 31, 2013", "XAR04004", "1.58[35]"],
    ["40", "4", "Midnight Ron", "Adam Reed & Tesha Kondrat", "February 7, 2013", "XAR04005", "1.28[36]"],
    ["41", "5", "Viscous Coupling", "Adam Reed", "February 14, 2013", "XAR04006", "1.15[37]"],
    ["42", "6", "Once Bitten", "Adam Reed", "February 21, 2013", "XAR04007", "1.70[38]"],
    ["43", "7", "Live and Let Dine", "Adam Reed", "February 28, 2013", "XAR04008", "1.52[39]"],
    ["44", "8", "Coyote Lovely", "Adam Reed", "March 7, 2013", "XAR04002", "1.53[40]"],
    ["45", "9", "The Honeymooners", "Mike Arnold & Adam Reed", "March 14, 2013", "XAR04009", "1.17[41]"],
    ["46", "10", "Un Chien Tangerine", "Adam Reed & Mike Arnold", "March 21, 2013", "XAR04010", "1.37[42]"],
    ["47", "11", "The Papal Chase", "Story by : Eric Sims Teleplay by : Adam Reed", "March 28, 2013", "XAR04011", "1.38[43]"],
    ["48", "12", "Sea Tunt: Part I", "Adam Reed", "April 4, 2013", "XAR04012", "1.30[44]"],
    ["49", "13", "Sea Tunt: Part II", "Adam Reed & Rick Cleveland", "April 11, 2013", "XAR04013", "1.61[45]"]
];

var season5 = [
    ["50", "1", "White Elephant", "Adam Reed", "January 13, 2014", "XAR05001", "1.65[46]"],
    ["51", "2", "Archer Vice: A Kiss While Dying", "Adam Reed", "January 20, 2014", "XAR05002", "1.17[47]"],
    ["52", "3", "Archer Vice: A Debt of Honor", "Adam Reed", "January 27, 2014", "XAR05003", "1.13[48]"],
    ["53", "4", "Archer Vice: House Call", "Adam Reed", "February 3, 2014", "XAR05004", "1.13[49]"],
    ["54", "5", "Archer Vice: Southbound and Down", "Adam Reed & Ben Hoffman", "February 24, 2014", "XAR05005", "1.05[50]"],
    ["55", "6", "Archer Vice: Baby Shower", "Adam Reed", "March 3, 2014", "XAR05009", "0.95[51]"],
    ["56", "7", "Archer Vice: Smugglers' Blues", "Adam Reed", "March 10, 2014", "XAR05006", "0.87[52]"],
    ["57", "8", "Archer Vice: The Rules of Extraction", "Adam Reed", "March 17, 2014", "XAR05007", "1.08[53]"],
    ["58", "9", "Archer Vice: On the Carpet", "Adam Reed", "March 24, 2014", "XAR05008", "0.91[54]"],
    ["59", "10", "Archer Vice: Palace Intrigue: Part I", "Adam Reed", "March 31, 2014", "XAR05010", "0.92[55]"],
    ["60", "11", "Archer Vice: Palace Intrigue: Part II", "Adam Reed", "April 7, 2014", "XAR05011", "0.87[56]"],
    ["61", "12", "Archer Vice: Filibuster", "Adam Reed", "April 14, 2014", "XAR05012", "1.07[57]"],
    ["62", "13", "Archer Vice: Arrival/Departure", "Adam Reed", "April 21, 2014", "XAR05013", "0.68[58]"]
];

var season6 = [
    ["63", "1", "The Holdout", "Adam Reed", "January 8, 2015", "XAR06001", "1.51[59]"],
    ["64", "2", "Three to Tango", "Adam Reed", "January 15, 2015", "XAR06002", "0.90[60]"],
    ["65", "3", "The Archer Sanction", "Adam Reed", "January 22, 2015", "XAR06003", "0.88[61]"],
    ["66", "4", "Edie's Wedding", "Adam Reed", "January 29, 2015", "XAR06004", "1.23[62]"],
    ["67", "5", "Vision Quest", "Adam Reed & Ben Hoffman", "February 5, 2015", "XAR06005", "0.98[63]"],
    ["68", "6", "Sitting", "Adam Reed", "February 12, 2015", "XAR06006", "0.81[64]"],
    ["69", "7", "Nellis", "Adam Reed", "February 19, 2015", "XAR06007", "1.08[65]"],
    ["70", "8", "The Kanes", "Adam Reed", "February 26, 2015", "XAR06008", "1.08[66]"],
    ["71", "9", "Pocket Listing", "Adam Reed", "March 5, 2015", "XAR06009", "0.92[67]"],
    ["72", "10", "Reignition Sequence", "Adam Reed", "March 12, 2015", "XAR06010", "1.07[68]"],
    ["73", "11", "Achub Y Morfilod", "Adam Reed & Mike Arnold Story inspiration from a rousing tale by Matthew Rhys", "March 19, 2015", "XAR06011", "0.84[69]"],
    ["74", "12", "Drastic Voyage: Part I", "Adam Reed & Casey Willis", "March 26, 2015", "XAR06012", "0.79[70]"],
    ["75", "13", "Drastic Voyage: Part II", "Adam Reed & Casey Willis", "April 2, 2015", "XAR06013", "0.72[71]"]
];

var season7 = [
    ["76", "1", "The Figgis Agency", "Adam Reed", "March 31, 2016", "XAR07001", "1.07[72]"],
    ["77", "2", "The Handoff", "Adam Reed", "April 7, 2016", "XAR07002", "0.75[73]"],
    ["78", "3", "Deadly Prep", "Adam Reed", "April 14, 2016", "XAR07003", "0.79[74]"],
    ["79", "4", "Motherless Child", "Adam Reed", "April 21, 2016", "XAR07004", "0.79[75]"],
    ["80", "5", "Bel Panto: Part I", "Adam Reed", "April 28, 2016", "XAR07005", "0.68[76]"],
    ["81", "6", "Bel Panto: Part II", "Adam Reed", "May 5, 2016", "XAR07006", "0.83[77]"],
    ["82", "7", "Double Indecency", "Adam Reed", "May 12, 2016", "XAR07007", "0.76[78]"],
    ["83", "8", "Liquid Lunch", "Adam Reed", "May 19, 2016", "XAR07008", "0.70[79]"],
    ["84", "9", "Deadly Velvet: Part I", "Adam Reed", "May 26, 2016", "XAR07009", "0.76[80]"],
    ["85", "10", "Deadly Velvet: Part II", "Adam Reed", "June 2, 2016", "XAR07010", "0.71[81]"]
];

var season8 = [
    ["86", "1", "Archer Dreamland: No Good Deed", "Adam Reed", "April 5, 2017", "XAR08001", "0.74[82]"],
    ["87", "2", "Archer Dreamland: Berenice", "Adam Reed", "April 12, 2017", "XAR08002", "0.50[83]"],
    ["88", "3", "Archer Dreamland: Jane Doe", "Adam Reed", "April 19, 2017", "XAR08003", "0.47[84]"],
    ["89", "4", "Archer Dreamland: Ladyfingers", "Adam Reed", "April 26, 2017", "XAR08004", "0.48[85]"],
    ["90", "5", "Archer Dreamland: Sleepers Wake", "Adam Reed", "May 3, 2017", "XAR08005", "0.44[86]"],
    ["91", "6", "Archer Dreamland: Waxing Gibbous", "Adam Reed", "May 10, 2017", "XAR08006", "0.38[87]"],
    ["92", "7", "Archer Dreamland: Gramercy, Halberd!", "Adam Reed", "May 17, 2017", "XAR08007", "0.31[88]"],
    ["93", "8", "Archer Dreamland: Auflösung", "Adam Reed", "May 24, 2017", "XAR08008", "0.42[89]"]
];

var seasons = [...season1, ...season2, ...season3, ...season4, ...season5, ...season6, ...season7, ...season8];
console.log(seasons);
var seasonData = [];
seasons.forEach(season => {
    seasonData.push({
        "No. overall": season[0],
        "No. in season": season[1],
        "Title": season[2],
        "Written by": season[3],
        "Original air date": season[4],
        "Prox. Code": season[5],
        "Viewers (millions)": season[6]
    });
});
seasonData = JSON.stringify(seasonData);
// copy(seasonData);