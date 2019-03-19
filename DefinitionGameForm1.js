function onOpen () {
    /*
    This is just a small function to automatically populate the Google Form with questions.
    */
    function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

    var form = FormApp.openById(getIdFromUrl("linkToForm"));
    var ss = SpreadsheetApp.openById(getIdFromUrl("linkToSpredSheet"));
    var sheets = ss.getSheets();
    var rows = sheets[1].getDataRange();
    var row1 = rows.getValues(); // There are two items in the row ... so we need to index later
    var item = form.getItems();

    var usedWords = [];
    var badItems = [];
    var col1 = []

    // Basically unpack the data first.
    for (i = 1; i < row1.length; i++){
      col1.push(row1[i][0])
    }

    // Test whether questions are already in the file.
    for (var i = 0; i < item.length; i++){
      // Test whether the item is a text item
      Logger.log(item[i].getType())
      if (item[i].getType() == 'TEXT' && item[i].getTitle() != 'TeamName'){
        // If it is text, test whether the item is in the word vector
        if (col1.indexOf(item[i].getTitle()) >= 0 && usedWords.indexOf(item[i].getTitle()) < 0){
          // If it is, put it into the usedWords list.
            usedWords.push(item[i].getTitle())

          } else {
            // If not, add the item to the badItem list.
          badItems.push(item[i])
          }

        }
    }
    var unusedWords = []
    // collect the words that are not yet titles:
    for (var k = 0; k < col1.length; k++){
      if (usedWords.indexOf(col1[k]) < 0){
        unusedWords.push(col1[k])
      }
     }

    var outOfList = 0

    for (var k = 0; k < unusedWords.length; k++){
      if (k < badItems.length){
        badItems[k].setTitle(unusedWords[k])
        outOfList++
      } else {
        var tempItem = form.addTextItem()
        tempItem.setTitle(unusedWords[k])
        }
    }

    if (outOfList <= badItems.length){
      for (j=outOfList; j < badItems.length; j++)
        form.deleteItem(badItems[j])
    }



  }