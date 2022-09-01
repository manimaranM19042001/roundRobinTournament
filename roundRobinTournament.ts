interface matchesType {opponent1:string;opponent2:string;matchId:string;venue:string;date:string;slot:string}

interface tournamentType {teamNames:string[];venue:string;startDate:Date;matches:matchesType[]}

let tournament = {
    teamNames: ["APPLE", "ORANGE", "PINEAPPLE", "MELON", "CHERRY"],
    venue :"chennai",
    startDate :new Date ("2022-09-13"),
} as tournamentType

//Function 1 : Preparing Matchlist  

function getListOfMatches(tournament :tournamentType) {
    let teamNamelist = tournament.teamNames      // List of teams
    let matches = []
    let teamCount = teamNamelist.length;

    const noOne = "noOne"
    if (teamNamelist.length % 2 != 0) {
        teamNamelist.push(noOne)
    }
    if (teamNamelist.includes("noOne")) {
        for (let i = 0; i <= teamCount - 1; i++) {  
            for (var j = 0; j < teamNamelist.length / 2; j++) {
                if (teamNamelist[j] != noOne && teamNamelist[teamNamelist.length - 1 - j] != noOne) {
                    let subMatch : any = {}
                    subMatch.opponent1 = teamNamelist[j]
                    subMatch.opponent2 = teamNamelist[teamNamelist.length - 1 - j]
                    matches.push(subMatch)
                }
            }
            teamNamelist.splice(1, 0, teamNamelist.pop()!); 
        }
        teamNamelist.pop()
        
    }
    else {
        for (let i = 0; i < teamCount - 1; i++) {
            for (var j = 0; j < teamNamelist.length / 2; j++) {
                let subMatch : any = {}
                subMatch.opponent1 = teamNamelist[j]
                subMatch.opponent2 = teamNamelist[teamNamelist.length - 1 - j]
                matches.push(subMatch)
            }
            teamNamelist.splice(1, 0, teamNamelist.pop()!);
        }
    }
    tournament.matches = matches
    tournament.teamNames = teamNamelist
    return tournament
}
tournament = getListOfMatches(tournament)

//console.log(tournament)

// Function 2 : Creating unique ID for every matches

function createMatchId(tournament:tournamentType) {
    let matches = tournament.matches
    matches.forEach(element => {
        var prefix = "RRT22"
        var opponentName1 = String(element.opponent1)
        var opponentName2 = String(element.opponent2)
        var sufix = `${opponentName1.slice(0, 1)}${opponentName2.slice(1, 2)}_${opponentName1.slice(0, 2)}${opponentName2.slice(0, 2)}`
        element.matchId = `${prefix}${sufix}`
    });
    return tournament
}
tournament = createMatchId(tournament)

//console.log(tournament)

// Function 3 : Assigning venue

function assignVenue(tournament : tournamentType){
    let matches = tournament.matches
    let venue = tournament.venue
    matches.forEach(element => element.venue =venue)
    return tournament
}
tournament = assignVenue(tournament)

//console.log(tournament)

// Function 4 : Assigning date 

function assignDate( tournament:tournamentType){
    let startDate = new Date(tournament.startDate)
    let matches = tournament.matches
    let noOfMatches = tournament.matches.length
    const secsInADAy  = ( 24 * 60 * 60 * 1000)       // Seconds in a day

    // Sub Function 1 : Format the date Ex: '18.9.2022'

    function formatTheDate(date : Date){
        return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
    }

    // Sub Function 2 : Find dates if the next nearest date is saturday 

    function saturday(firstDay : Date) {
        var dates = [formatTheDate(firstDay)]
        let Sunday_ = new Date(firstDay.getTime() + secsInADAy)
        dates.push(formatTheDate(Sunday_))
        
        for (let i = 1; i <= Math.ceil(noOfMatches/2); i++) {
            var nextSun = new Date(firstDay.getTime() + (7 * i) * secsInADAy);
            dates.push(formatTheDate(nextSun))
            var nextSat = new Date(nextSun.getTime() + secsInADAy);
            dates.push(formatTheDate(nextSat))
        } return (dates)
    }
    
    // Sub Function 2 : Find dates if the next nearest date is sunday 

    function Sunday(firstDay: Date) {
        var dates = [formatTheDate(firstDay)]
        let saturday_ = (new Date(firstDay.getTime() + (6) * secsInADAy))
        dates.push(formatTheDate(saturday_))
        let Sunday_ = new Date(saturday_.getTime() + secsInADAy)
        dates.push(formatTheDate(Sunday_))
    
        for (let i = 1; i <= Math.ceil(noOfMatches/2); i++) {
            var nextSat = new Date(saturday_.getTime() + (7 * i) * secsInADAy);
            dates.push(formatTheDate(nextSat))
            var nextSun = new Date(nextSat.getTime() + secsInADAy);
            dates.push(formatTheDate(nextSun))
        } return (dates)
    }

    var dates:any = ""
    for (let i =1 ; i < 7; i++) {
        let date = new Date(startDate.getTime() + i * (secsInADAy))
        if (date.getDay() == 0) {
            dates = Sunday(date)
            break
        }
        else if (date.getDay() == 6) {
            dates = saturday(date)
            break
        }
    }

    // ****************************************************
    // Assigning dates and slots for each matches 


    var j =0 
    for (let i=0;i<matches.length;i+=2){
        matches[i].date = dates[j]
        matches[i].slot = "Morning"
        j++
    }
     j =0 
    for (let i=1;i<matches.length;i+=2){
        matches[i].date = dates[j]
        matches[i].slot = "Evening"
        j++
    }

    tournament.matches = (matches)
    return (tournament) 
}

tournament = assignDate( tournament)

console.log(tournament)

// // **********************************************************************************************************************************
// // **********************************************************************************************************************************

// Sorting functions 
 
function sortByOpponents(playerName : any){
    let matches = tournament.matches.filter(element => element.opponent1.includes(playerName) || element.opponent2.includes(playerName))
    console.log(`\nList of matches in which team '${playerName}' participating:`)
    console.log(matches)
}

function sortByVenue(enteredvenue:any){
    let matches = tournament.matches.filter(element => element.venue.includes(enteredvenue))
    console.log(`\nList of matches, which are all happening in the '${enteredvenue}':`)
    console.log(matches)
}

function sortByMatchID(enteredMatchID:any){
    let matches = tournament.matches.filter(element => element.matchId.includes(enteredMatchID))
    console.log(`\nDetails for the matchID '${enteredMatchID}':`)
    console.log(matches)
}

function sortBySlot(enteredslot:any){
    let matches = tournament.matches.filter(element => element.slot.includes(enteredslot))
    console.log(`\nList of matches, which are all will be conducted in the '${enteredslot}' slot:`)
    console.log(matches)
}

function sortByDate(enteredDate:any){
    let matches = tournament.matches.filter(element => element.date.includes(enteredDate))
    console.log(`\nList of matches, which are happening in the Date :- '${enteredDate}':`)
    console.log(matches)
}

// **********************************************************************************************************************************
// **********************************************************************************************************************************

// sortByOpponents('ORANGE')
// sortByMatchID('RRT22OH_ORCH')
// sortBySlot('Morning')
// sortByVenue('chennai')
// sortByDate('24.9.2022')
