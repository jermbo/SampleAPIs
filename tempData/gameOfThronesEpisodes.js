// var table = document.querySelectorAll('.wikitable');
// var tableRows = [...table[1].querySelectorAll('tr')];
// var data = tableRows.map(row => row.innerText);
// copy(data);

var season1 = [
    ["1", "1", "Winter Is Coming", "Tim Van Patten", "David Benioff & D. B. Weiss", "April 17, 2011", "2.22[19]"],
    ["2", "2", "The Kingsroad", "Tim Van Patten", "David Benioff & D. B. Weiss", "April 24, 2011", "2.20[20]"],
    ["3", "3", "Lord Snow", "Brian Kirk", "David Benioff & D. B. Weiss", "May 1, 2011", "2.44[21]"],
    ["4", "4", "Cripples, Bastards, and Broken Things", "Brian Kirk", "Bryan Cogman", "May 8, 2011", "2.45[22]"],
    ["5", "5", "The Wolf and the Lion", "Brian Kirk", "David Benioff & D. B. Weiss", "May 15, 2011", "2.58[23]"],
    ["6", "6", "A Golden Crown", "Daniel Minahan", "Story by : David Benioff & D. B. Weiss Teleplay by : Jane Espenson and David Benioff & D. B. Weiss", "May 22, 2011", "2.44[24]"],
    ["7", "7", "You Win or You Die", "Daniel Minahan", "David Benioff & D. B. Weiss", "May 29, 2011", "2.40[25]"],
    ["8", "8", "The Pointy End", "Daniel Minahan", "George R. R. Martin", "June 5, 2011", "2.72[26]"],
    ["9", "9", "Baelor", "Alan Taylor", "David Benioff & D. B. Weiss", "June 12, 2011", "2.66[27]"],
    ["10", "10", "Fire and Blood", "Alan Taylor", "David Benioff & D. B. Weiss", "June 19, 2011", "3.04[28]"]
  ]

var season2 = [
    ["11", "1", "The North Remembers", "Alan Taylor", "David Benioff & D. B. Weiss", "April 1, 2012", "3.86[29]"],
    ["12", "2", "The Night Lands", "Alan Taylor", "David Benioff & D. B. Weiss", "April 8, 2012", "3.76[30]"],
    ["13", "3", "What Is Dead May Never Die", "Alik Sakharov", "Bryan Cogman", "April 15, 2012", "3.77[31]"],
    ["14", "4", "Garden of Bones", "David Petrarca", "Vanessa Taylor", "April 22, 2012", "3.65[32]"],
    ["15", "5", "The Ghost of Harrenhal", "David Petrarca", "David Benioff & D. B. Weiss", "April 29, 2012", "3.90[33]"],
    ["16", "6", "The Old Gods and the New", "David Nutter", "Vanessa Taylor", "May 6, 2012", "3.88[34]"],
    ["17", "7", "A Man Without Honor", "David Nutter", "David Benioff & D. B. Weiss", "May 13, 2012", "3.69[35]"],
    ["18", "8", "The Prince of Winterfell", "Alan Taylor", "David Benioff & D. B. Weiss", "May 20, 2012", "3.86[36]"],
    ["19", "9", "Blackwater", "Neil Marshall", "George R. R. Martin", "May 27, 2012", "3.38[37]"],
    ["20", "10", "Valar Morghulis", "Alan Taylor", "David Benioff & D. B. Weiss", "June 3, 2012", "4.20[38]"]
  ]

var season3 = [
    ["21", "1", "Valar Dohaeris", "Daniel Minahan", "David Benioff & D. B. Weiss", "March 31, 2013", "4.37[39]"],
    ["22", "2", "Dark Wings, Dark Words", "Daniel Minahan", "Vanessa Taylor", "April 7, 2013", "4.27[40]"],
    ["23", "3", "Walk of Punishment", "David Benioff", "David Benioff & D. B. Weiss", "April 14, 2013", "4.72[41]"],
    ["24", "4", "And Now His Watch Is Ended", "Alex Graves", "David Benioff & D. B. Weiss", "April 21, 2013", "4.87[42]"],
    ["25", "5", "Kissed by Fire", "Alex Graves", "Bryan Cogman", "April 28, 2013", "5.35[43]"],
    ["26", "6", "The Climb", "Alik Sakharov", "David Benioff & D. B. Weiss", "May 5, 2013", "5.50[44]"],
    ["27", "7", "The Bear and the Maiden Fair", "Michelle MacLaren", "George R. R. Martin", "May 12, 2013", "4.84[45]"],
    ["28", "8", "Second Sons", "Michelle MacLaren", "David Benioff & D. B. Weiss", "May 19, 2013", "5.13[46]"],
    ["29", "9", "The Rains of Castamere", "David Nutter", "David Benioff & D. B. Weiss", "June 2, 2013", "5.22[47]"],
    ["30", "10", "Mhysa", "David Nutter", "David Benioff & D. B. Weiss", "June 9, 2013", "5.39[48]"]
  ]

var season4 = [
    ["31", "1", "Two Swords", "D. B. Weiss", "David Benioff & D. B. Weiss", "April 6, 2014", "6.64[49]"],
    ["32", "2", "The Lion and the Rose", "Alex Graves", "George R. R. Martin", "April 13, 2014", "6.31[50]"],
    ["33", "3", "Breaker of Chains", "Alex Graves", "David Benioff & D. B. Weiss", "April 20, 2014", "6.59[51]"],
    ["34", "4", "Oathkeeper", "Michelle MacLaren", "Bryan Cogman", "April 27, 2014", "6.95[52]"],
    ["35", "5", "First of His Name", "Michelle MacLaren", "David Benioff & D. B. Weiss", "May 4, 2014", "7.16[53]"],
    ["36", "6", "The Laws of Gods and Men", "Alik Sakharov", "Bryan Cogman", "May 11, 2014", "6.40[54]"],
    ["37", "7", "Mockingbird", "Alik Sakharov", "David Benioff & D. B. Weiss", "May 18, 2014", "7.20[55]"],
    ["38", "8", "The Mountain and the Viper", "Alex Graves", "David Benioff & D. B. Weiss", "June 1, 2014", "7.17[56]"],
    ["39", "9", "The Watchers on the Wall", "Neil Marshall", "David Benioff & D. B. Weiss", "June 8, 2014", "6.95[57]"],
    ["40", "10", "The Children", "Alex Graves", "David Benioff & D. B. Weiss", "June 15, 2014", "7.09[58]"]
  ]

var season5 = [
    ["41", "1", "The Wars to Come", "Michael Slovis", "David Benioff & D. B. Weiss", "April 12, 2015", "8.00[59]"],
    ["42", "2", "The House of Black and White", "Michael Slovis", "David Benioff & D. B. Weiss", "April 19, 2015", "6.81[60]"],
    ["43", "3", "High Sparrow", "Mark Mylod", "David Benioff & D. B. Weiss", "April 26, 2015", "6.71[61]"],
    ["44", "4", "Sons of the Harpy", "Mark Mylod", "Dave Hill", "May 3, 2015", "6.82[62]"],
    ["45", "5", "Kill the Boy", "Jeremy Podeswa", "Bryan Cogman", "May 10, 2015", "6.56[63]"],
    ["46", "6", "Unbowed, Unbent, Unbroken", "Jeremy Podeswa", "Bryan Cogman", "May 17, 2015", "6.24[64]"],
    ["47", "7", "The Gift", "Miguel Sapochnik", "David Benioff & D. B. Weiss", "May 24, 2015", "5.40[65]"],
    ["48", "8", "Hardhome", "Miguel Sapochnik", "David Benioff & D. B. Weiss", "May 31, 2015", "7.01[66]"],
    ["49", "9", "The Dance of Dragons", "David Nutter", "David Benioff & D. B. Weiss", "June 7, 2015", "7.14[67]"],
    ["50", "10", "Mother's Mercy", "David Nutter", "David Benioff & D. B. Weiss", "June 14, 2015", "8.11[68]"]
  ]

var season6 = [
    ["51", "1", "The Red Woman", "Jeremy Podeswa", "David Benioff & D. B. Weiss", "April 24, 2016", "7.94[69]"],
    ["52", "2", "Home", "Jeremy Podeswa", "Dave Hill", "May 1, 2016", "7.29[70]"],
    ["53", "3", "Oathbreaker", "Daniel Sackheim", "David Benioff & D. B. Weiss", "May 8, 2016", "7.28[71]"],
    ["54", "4", "Book of the Stranger", "Daniel Sackheim", "David Benioff & D. B. Weiss", "May 15, 2016", "7.82[72]"],
    ["55", "5", "The Door", "Jack Bender", "David Benioff & D. B. Weiss", "May 22, 2016", "7.89[73]"],
    ["56", "6", "Blood of My Blood", "Jack Bender", "Bryan Cogman", "May 29, 2016", "6.71[74]"],
    ["57", "7", "The Broken Man", "Mark Mylod", "Bryan Cogman", "June 5, 2016", "7.80[75]"],
    ["58", "8", "No One", "Mark Mylod", "David Benioff & D. B. Weiss", "June 12, 2016", "7.60[76]"],
    ["59", "9", "Battle of the Bastards", "Miguel Sapochnik", "David Benioff & D. B. Weiss", "June 19, 2016", "7.66[77]"],
    ["60", "10", "The Winds of Winter", "Miguel Sapochnik", "David Benioff & D. B. Weiss", "June 26, 2016", "8.89[78]"]
  ]

var season7 = [
    ["61", "1", "Dragonstone", "Jeremy Podeswa", "David Benioff & D. B. Weiss", "July 16, 2017", "10.11[79]"],
    ["62", "2", "Stormborn", "Mark Mylod", "Bryan Cogman", "July 23, 2017", "9.27[80]"],
    ["63", "3", "The Queen's Justice", "Mark Mylod", "David Benioff & D. B. Weiss", "July 30, 2017", "9.25[81]"],
    ["64", "4", "The Spoils of War", "Matt Shakman", "David Benioff & D. B. Weiss", "August 6, 2017", "10.17[82]"],
    ["65", "5", "Eastwatch", "Matt Shakman", "Dave Hill", "August 13, 2017", "10.72[83]"],
    ["66", "6", "Beyond the Wall", "Alan Taylor", "David Benioff & D. B. Weiss", "August 20, 2017", "10.24[84]"],
    ["67", "7", "The Dragon and the Wolf", "Jeremy Podeswa", "David Benioff & D. B. Weiss", "August 27, 2017", "12.07[85]"]
  ]

var season8 = [
    ["68", "1", "TBA", "David Nutter", "Dave Hill", "2019", "TBD"],
    ["69", "2", "TBA", "David Nutter", "Bryan Cogman", "2019", "TBD"],
    ["70", "3", "TBA", "Miguel Sapochnik", "David Benioff & D. B. Weiss", "2019", "TBD"],
    ["71", "4", "TBA", "David Nutter", "David Benioff & D. B. Weiss", "2019", "TBD"],
    ["72", "5", "TBA", "Miguel Sapochnik", "David Benioff & D. B. Weiss", "2019", "TBD"],
    ["73", "6", "TBA", "David Benioff & D. B. Weiss", "David Benioff & D. B. Weiss", "2019", "TBD"]
  ]


var seasons = [...season1, ...season2, ...season3, ...season4, ...season5, ...season6, ...season7, ...season8];
console.log(seasons);
var seasonData = [];
seasons.forEach(season => {
    seasonData.push({
        "No. overall": season[0],
        "No. in season": season[1],
        "Title": season[2],
        "Directed by": season[3],
        "Written by": season[4],
        "Original air date": season[5],
        "Viewers (millions)": season[6]
    });
});
seasonData = JSON.stringify(seasonData);
// copy(seasonData);