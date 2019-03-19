function myFunction() {
    /*
  This is just a small function to automatically populate the Google Form with questions.
  */
  function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

    function matchColAndRow(question, responseSheet, questionSheet){
    // First find the column index in the SpreadSheet:
    var colIdx = -1
    for (var i = 0; i < responseSheet[0].length; i++){
      if (responseSheet[0][i] == question){
        colIdx = i;
      }
    }
    // Then find the row index for the word
    var rowIdx = -1
    for (var i=0; i < questionSheet.length; i++){
      if (questionSheet[i][0] == question){
        rowIdx = i;
      }
    }

    // Create the possible answers for later:
  var responseChoice = [];
  var realChoice = []
  //var temp = form.addMultipleChoiceItem()
  for (var i = 1; i < responseSheet.length; i++){
    responseChoice.push(responseSheet[i][colIdx]);
    //realChoice.push(temp.createChoice(responseSheet[i][colIdx]))
  }
  // Add the correct answer, hopefully answers are going to be shuffled automatically
  responseChoice.push(questionSheet[rowIdx][1]);
  //realChoice.push(temp.createChoice(questionSheet[rowIdx][1]))
  //form.deleteItem(temp)
    return responseChoice //, realChoice]
  }

  var ss = SpreadsheetApp.openById(getIdFromUrl("linkTospreadSheet"));
  var sheets = ss.getSheets();
  var teamsAndResponses = sheets[0].getDataRange().getValues();
  var questionsAndAnswers = sheets[1].getDataRange().getValues();
  var teamsAndGuesses = sheets[2].getDataRange().getValues()
  var resultSheet = sheets[3];

  // First collect the words:
  var words = ['Team']
  var answers = []
  var teams = []
  var teamsRow = []

  // Find the number of teams
  var teamIndex = teamsAndResponses[0].indexOf('TeamName')
  var teamIndex2 = teamsAndGuesses[0].indexOf('Your old Team Name')
  // Save the teams
  for (var i = 1; i < teamsAndResponses.length; i++){


    teams.push(teamsAndResponses[i][teamIndex])
    for (var j = 1; j < teamsAndGuesses.length; j++){
      if (teamsAndGuesses[j][teamIndex2] == teamsAndResponses[i][teamIndex]){

        teamsRow.push([i, j])
      }
    }
  }

  // Find the words and corresponding answers.
  for (var i = 1; i < questionsAndAnswers.length; i++){
    words.push(questionsAndAnswers[i][0])
    answers.push(questionsAndAnswers[i][1])
  }

 resultSheet.clear()
 var tmp = []
 tmp = tmp.concat(words); tmp.push(' '); tmp = tmp.concat(words.slice(1));
 resultSheet.appendRow(tmp);
 var resultWordIdx = []
 for (var i = 1; i < words.length; i++){
   var tmpIdx = []
   for(var j =0; j < teamsAndGuesses[0].length; j++){

     if (teamsAndGuesses[0][j] == words[i]){
       tmpIdx.push(j)
     }
   }
   resultWordIdx.push(tmpIdx)
 }
 Logger.log(teamsRow)
  for (var i = 0; i < teams.length; i++)
  {
    var printRow = [teams[i]]
    var scoreRow = []
    for (var j = 0; j <  words.length -1; j++){
      for (t = 0; t < resultWordIdx[j].length; t++){
        Logger.log(teamsRow[i][1])
        var tmpRow = teamsAndGuesses[teamsRow[i][1]][resultWordIdx[j][t]]

        if (tmpRow != ''){
          printRow.push(tmpRow)
        }
      }

      var tempQuestion = matchColAndRow(words[j+1], teamsAndResponses, questionsAndAnswers)
      var test = -1;
      for (var b = 0; b < tempQuestion.length; b++){
        Logger.log(tmpRow)
        Logger.log(printRow)
        if (tempQuestion[b].replace(/\s+/g, '') == printRow[printRow.length -1].replace(/\s+/g, '')){

          test = b
          Logger.log(b)
          }

      }

      var idOf = test
      if (idOf < teams.length){
          idOf = teams[idOf];
        } else {
          idOf = 'correct'
        }
      scoreRow.push(idOf)

    }

    printRow.push(' ');
    for (var c = 0; c < scoreRow.length; c++){
      printRow.push(scoreRow[c]);
    }
    resultSheet.appendRow(printRow);

  }
}