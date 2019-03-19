# Dictionary Game
This is just a place where I keep the currently working files for a gs-script
based group game.
Basically this game is based on [this group game][1]. Participants will invent
a definition for some uncommon words, to trick other teams or participants
into chosing their definition.

# Structure and Introductions
This is still pretty much a complete mess, however, it works somehow. The
result of learning JavaScript in one day.
To run the game, you need a Google spreadsheet and two Google forms.
1. Link the first Google form to the first sheet in the Google spreadsheet.
2. Go to the second sheet, and use the first two columns as "Words" and "Real"
 the label actually doesn't matter. The scripts will start looking for words and definitions in the second row.
3. Run the script "DefinitionGameForm1.js". Basically go to add scripts in the Form settings. Furthermore add a description etc. The script will add questions etc. based on the Words in "Words".
4. After people answered the questions link the 3rd Form to the 3rd sheet. And run "DefintionGameForm3.js"
5. To get an overview over the results run DefinitionGameResults.js in the Spreadsheet.

**Important** : You have to add the URLs of the corresponding forms to the scripts. And allow the scripts to alter your files...

**Important** : To reset the game you have to delete columns and rows in the spreadsheet. This is really annoying and might be fixed at later stages.


# TODOs
1. Add commentary to files.
2. Make procedure more automatic. I.e. create the forms only based on the spreadsheets. So that all scripts can be put into one.
3. Possible more testing and bug-fixing.
4. Parsing of information in spreadsheet, to be interpreted as strings (this lead to some issues previously)
5. Maybe make all of it into a web-app.



[1]: http://www.greatgroupgames.com/the-dictionary-game.htm