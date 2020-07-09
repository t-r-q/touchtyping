## PROJECT

## Environment & Tools
Operating system: Windows 10, IDE: WebStorm, compiler: Mingw-w64, CMake: Bundled version3.15.3 and Git version 2.23, Browser: firefox and chrom. 

## Purpose / Syfte 
Build a project website that measures the touch typing speed for a user, the project has a page, which specific a width of 600px, to make the user of the application focused on the event center.
that measures the user's typing speed and hit accuracy when typing with the keyboard. 
Focus on reproducing speed and error rate statistics, with the results appearing on the screen through numbers and changing the color of the letters, 
To help the user to know where the error occurred and the reasons for the shortcomings, which allows him to develop his capabilities in touch typing,
and the graph for the printing process touch typing speed, to make it easy for the user to monitor the printing speed.


## Procedures / Genomförande
A page will be created HTML page, which has all elements set in HTML that divide the page into a header has a logo, a footer has developer's email with rights, and a body that contains all the elements of the Tags HTML.
The body consists of four sections. The first section is the options for the user, such as the case of letters if he wants to write a sensitive casing to the letter case or exceeded it, 
and if the user chooses the text in English or Swedish language, and based on that select option will fill out the data.
The second section is a place to show the text that the user will practice writing it, which consists of the title of the text, the name of the author, the number of letters and the words in the text. 
The third section is a place to enter the letter from the user(label), and the start and stop button, to starting or stopping the gaming process.
The last section shows the calculations, the speed of touch typing, the counting of errors that occurred, and the graph of the game events.
All tags in HTML page inheritance attribute and style from style.css
JavaScript codes included in the main.js file in the js folder, 
Event starts loading data from XML and puts aventlistening to all input radios for languages and select menu, to monitor any user change. 
Compare the entries with the displayed text and perform the arithmetic operations of the letters if they are right or wrong to display them to the user.
 
## Discussion / Diskussion
There was difficulty in checking the status of the chars while pressing the shiftKey with any character, as they were considered two letters for this, 
I had to check the event in eventlistening at the time of entering the character from user.