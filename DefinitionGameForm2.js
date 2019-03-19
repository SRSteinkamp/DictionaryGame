function onOpen () {
    /*
    This is just a small function to automatically populate the Google Form with questions.
    */
    function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

    /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
  }

    /*
    Function that is supposedly creating the answer sets for a given word.
    */
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

    // Here the mess begins:
    var form = FormApp.openById(getIdFromUrl("linkToCurrentForm"));
    var ss = SpreadsheetApp.openById(getIdFromUrl("linkToSpreadsheet"));
    var sheets = ss.getSheets();
    var teamsAndResponses = sheets[0].getDataRange();
    var questionsAndAnswers = sheets[1].getDataRange().getValues();
    var tARRows = teamsAndResponses.getValues(); // There are two items in the row ... so we need to index later
    var words = []
    var answers = []
    var teams = []
    var teamsRow = []
    var oldItems = form.getItems()

    // Clear page, that can be done in a better way
    for (var i = 0; i < oldItems.length; i++)
    {
      form.deleteItem(oldItems[i])
    }

    // Find the number of teams
    var teamIndex = tARRows[0].indexOf('TeamName')
    // Save the teams
    for (var i = 1; i < tARRows.length; i++){
      teams.push(tARRows[i][teamIndex])
      teamsRow.push(i)
    }

    // Find the words and corresponding answers.
    for (var i = 1; i < questionsAndAnswers.length; i++){
      words.push(questionsAndAnswers[i][0])
      answers.push(questionsAndAnswers[i][1])
    }
    Logger.log(words)
    // Create sets of questions
    var questionSets = []
    for (var i = 0; i < words.length; i++)
    {
    var tempQuestion = matchColAndRow(words[i], tARRows, questionsAndAnswers)
    questionSets.push(tempQuestion)
    }

    // Create a Multiple Choice element on the first page.
    var teamChooser = form.addMultipleChoiceItem()
    var teamChoices = []

    // Create many pages for each team, so that they can only select their answers.
    var pageIndex = [];
    for (var k = 0; k < teams.length; k++){

      var tempPage  = form.addPageBreakItem()
      tempPage.setGoToPage(FormApp.PageNavigationType.SUBMIT)
      pageIndex.push(tempPage);
      tempPage.setTitle(teams[k])

      for (var i = 0; i < questionSets.length; i++){
        var multiChoice = form.addMultipleChoiceItem()
        var multiChoices = []
        for (var j = 0; j < questionSets[i].length; j++){
          if (j != k){
            multiChoices.push(multiChoice.createChoice(questionSets[i][j]))
            //multiChoices.push(questionSets[i][j])
          }};
        multiChoice.setChoices(shuffle(multiChoices));
        multiChoice.setTitle(words[i]);
      }
    }

    for (var i = 0; i < teams.length; i++){
      teamChoices.push(teamChooser.createChoice(teams[i], pageIndex[i]))}
    teamChooser.setChoices(teamChoices)
    teamChooser.setTitle('Your old Team Name')
    teamChooser.setRequired(true)
  }