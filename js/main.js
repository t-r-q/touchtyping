var arr_text = [];
var dataB = [];
var xhttp;

function loadXMLDoc() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            fillArrWithXML(this);
        }
    };
    xhttp.open("GET", "texts.xml", true);
    xhttp.send();
}

window.addEventListener("load", function () {
    start();
});

/*
Initialize arrays and select menu with data,
and register event handlers for start and stop buttons.
 */
function start() {
     loadXMLDoc();

    if (arr_text === "undefined" || arr_text.length == null) {
        loadXMLDoc();

        fillArrWithText();
        for (let i = 0; i < arr_text.length; i++) {
            SetOptionInSelect(arr_text[i]);
        }
}

// Get index of select name text.
    const selectElementMenu = document.querySelector('.select_Name_text');
    if (selectElementMenu) {
        selectElementMenu.addEventListener('change', function () {
            var index_selectM = selectElementMenu.selectedIndex;
            printTexttoScreen(dataB[index_selectM - 1][1], dataB[index_selectM - 1][0], dataB[index_selectM - 1][2]);
        });
    }

    document.getElementById("startB").addEventListener(
        "click", startBTN, false);
    document.getElementById("stopB").addEventListener(
        "click", stopBTN, false);
    var btnSrc = document.getElementById("stopB");
    if (btnSrc) {
        btnSrc.style.visibility = "hidden";
    }
    drawCanvas(0);
} // end function start


// ----------- Button for start play input from user
function startBTN() {
    let t = document.getElementById("txtarea").value;
    if (t) {
        var startTime = new Date().getTime();
        setSessionCharNr("timeMsec", startTime);
        var btnStart = document.getElementById("startB");
        var btnStop = document.getElementById("stopB");
        btnStart.style.visibility = "hidden";
        btnStop.style.visibility = "visible";
        setSessionCharNr("char_num", 0);
        setSessionCharNr("error_num", 0);
        setSessionCharNr("gresK", 0);
        highlightChar(0);
        var checkBox = document.getElementById("caseChar").checked;
        if (checkBox) {
            document.getElementById("user_input").addEventListener("keyup", function (event) {
                if (!event.altKey && !event.shiftKey && !event.ctrlKey) {
                    playInputWithoutCasing();
                }
            });
        } else {
            document.getElementById("user_input").addEventListener("keyup", function (event) {
                if (!event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
                    playInputWithCasingChar();
                }
            });
        }
        document.getElementById("user_input").focus();
    }

}

// Button finish game.
function stopBTN() {
    var btnStart = document.getElementById("startB");
    var btnStop = document.getElementById("stopB");
    btnStop.style.visibility = "hidden";
    btnStart.style.visibility = "visible";
    document.getElementById('user_input').value = "";
    document.getElementById('user_input').setAttribute('readonly', true);
    var checkBox = document.getElementById("caseChar").checked;
    if (checkBox) {
        document.getElementById("user_input").removeEventListener("keyup", playInputWithoutCasing);
    } else {
        document.getElementById("user_input").removeEventListener("keyup", playInputWithCasingChar);
    }

}

/*
Play input function for get character value from user and check it if right character, change class name for element to
rightChar or if not change class name to errorChar
 */
function playInputWithCasingChar() {
    var txt = document.getElementById("txtarea").value;
    let user_input = document.getElementById("user_input");
    var charNr = getCharFSession("char_num"); // number char in the string
    var errorNr = getCharFSession("error_num"); // number errors

    if (user_input.value) {

        if (charNr < txt.length) {
            highlightChar(charNr + 1);
            var char_input = user_input.value.charAt(user_input.value.length - 1);
            var spanElement = document.getElementById("sp" + charNr);
            if (char_input.indexOf(' ') >= 0) {
                user_input.value = "";
            }

            if (char_input === txt[charNr]) {
                spanElement.className = "rightChar";
            } else {

                spanElement.className = "errorChar";
                setSessionCharNr("error_num", errorNr + 1);
            }

            setSessionCharNr("char_num", charNr + 1);

            Statistics(charNr, errorNr);
        } else {
            document.getElementById("user_input").removeEventListener("keypress", playInputWithCasingChar);
            setSessionCharNr("char_num", 0);
            var btnStart = document.getElementById("startB");
            var btnStop = document.getElementById("stopB");
            btnStop.style.visibility = "hidden";
            btnStart.style.visibility = "visible";
            document.getElementById('user_input').setAttribute('readonly', true);
        }
    }

}


// -------------------
function playInputWithoutCasing(event) {
    var txt = document.getElementById("txtarea").value;
    let user_input = document.getElementById("user_input");
    var charNr = getCharFSession("char_num"); // number char in the string
    var errorNr = getCharFSession("error_num"); // number errors

    if (user_input.value) {

        if (charNr < txt.length) {
            highlightChar(charNr + 1);
            var char_input = user_input.value.charAt(user_input.value.length - 1);
            var spanElement = document.getElementById("sp" + charNr);
            if (char_input.indexOf(' ') >= 0) {
                user_input.value = "";
            }

            if (char_input.toLowerCase() === txt[charNr].toLowerCase()) {
                spanElement.className = "rightChar";
            } else {
                spanElement.className = "errorChar";
                setSessionCharNr("error_num", errorNr + 1);
            }


            setSessionCharNr("char_num", charNr + 1);

            Statistics(charNr, errorNr);
        } else {
            document.getElementById("user_input").removeEventListener("keypress", playInputWithoutCasing);
            setSessionCharNr("char_num", 0);
            var btnStart = document.getElementById("startB");
            var btnStop = document.getElementById("stopB");
            btnStop.style.visibility = "hidden";
            btnStart.style.visibility = "visible";
            document.getElementById('user_input').setAttribute('readonly', true);
        }
    }


}

// Display the current target text
function highlightChar(ch) {
    var spanElement = document.getElementById("sp" + ch);
    if (spanElement) {
        spanElement.className = "selectChar";
    }
}


// ---- Function Return number for words count in string --------
String.prototype.countWords = function () {
    return this.split(/\s+\b/).length;
}

//--------- add Event to radio fill data when change it ----------------
window.addEventListener("change", function () {
    fillArrWithText();
    cleanOptionFromSelect();
    for (let i = 0; i < arr_text.length; i++) {
        SetOptionInSelect(arr_text[i]);
    }
});


/*
Print data (title text, artist, count words in text and text) to screen
 */
function printTexttoScreen(title, artist, poetry) {
    //  var tag_elem = document.createElement("span");
    var contTitle = document.getElementById('title_text');
    var contArtist = document.getElementById('artist_text');
    var contText = document.getElementById('txtarea');
    contTitle.textContent = '';
    contArtist.textContent = '';
    contText.textContent = '';
    var wordCount = poetry.countWords();
    setSessionCharNr("wordsNr", wordCount);
    var charCount = poetry.length;
    document.getElementById('txtarea').value = poetry;
    contTitle.textContent = title;
    // contTitle.insertAdjacentText('afterbegin', title);
    contArtist.textContent = (artist + " (" + wordCount + " words, " + charCount + " chars)");
    // contArtist.insertAdjacentText('afterbegin', artist + " (" + wordCount + " words, " + charCount + " chars)");
    var txt = [];
    for (let i = 0; i < charCount; i++) {
        txt += "<span id='sp" + i + "'>" + poetry[i] + "</span>";
    }
    // contText.insertAdjacentHTML('afterbegin', txt);
    contText.innerHTML = txt;
}

// upload data from XML File and save it in arrays
function fillArrWithXML(xml) {
    var radio_language = getLanguage();
    var xtitle, xauthor, xtext, xlanguag, xmlDoc;
    var elem1 = [];
    xmlDoc = xml.responseXML;

    xtitle = xmlDoc.getElementsByTagName("title");
    xauthor = xmlDoc.getElementsByTagName("author");
    xtext = xmlDoc.getElementsByTagName("text");
    xlanguag = xmlDoc.getElementsByTagName("language");
    var xlen = xtext.length;

    if (radio_language === "swe") {
        for (let i = 0; i < xlen; i++) {
            if (xlanguag[i].childNodes[0].nodeValue === 'swedish') {
                elem1 = [xtitle[i].childNodes[0].nodeValue, xauthor[i].childNodes[0].nodeValue, xtext[i].childNodes[0].nodeValue];
                SetOptionInSelect(xtitle[i].childNodes[0].nodeValue, xauthor[i].childNodes[0].nodeValue, xtext[i].childNodes[0].nodeValue);
                arr_text.push(xtitle[i].childNodes[0].nodeValue);
                dataB.push(elem1);
            }
        }

    } else if (radio_language === "eng") {
        for (let i = 0; i < xlen; i++) {
            if (xlanguag[i].childNodes[0].nodeValue === 'english') {
                elem1 = [xtitle[i].childNodes[0].nodeValue, xauthor[i].childNodes[0].nodeValue, xtext[i].childNodes[0].nodeValue];
                SetOptionInSelect(xtitle[i].childNodes[0].nodeValue, xauthor[i].childNodes[0].nodeValue, xtext[i].childNodes[0].nodeValue);
                arr_text.push(xtitle[i].childNodes[0].nodeValue);
                dataB.push(elem1);
            }
        }
    }

}

// Fill array with text data depending on the language chosen -----
function fillArrWithText() {
    var radio_language = getLanguage();

    if (radio_language === "swe") {
        arr_text = [stxt1[1], stxt2[1], stxt3[1]];
        dataB = [stxt1, stxt2, stxt3];
    } else if (radio_language === "eng") {
        arr_text = [etxt1[1], etxt2[1], etxt3[1]];
        dataB = [etxt1, etxt2, etxt3];
    }

}

//

// Get language ------------------------------------------
function getLanguage() {
    var lagua;
    var radio_lang = document.getElementsByName("language");
    for (i = 0; i < radio_lang.length; i++) {
        if (radio_lang[i].checked)
            lagua = radio_lang[i].value;
    }
    return lagua;
}

// Select option as per language
function SetOptionInSelect(txt_name) {
    var op = document.getElementById("txt");
    var option = document.createElement("option");
    option.text = txt_name;
    op.add(option);
}

// Delete all option in list
function cleanOptionFromSelect() {
    var op = document.getElementById("txt");
    for (let x = op.length; x > 0; x--) {
        op.remove(x);
    }
}

//------------- Add last character number writed it to session storage
function setSessionCharNr(charKey, vCharNr) {
    sessionStorage.setItem(charKey, JSON.stringify(vCharNr));
}

//  ----   Get data from session storage
function getCharFSession(varKey) {
    var varChar = JSON.parse(sessionStorage.getItem(varKey));
    if (varChar !== null) {
        console.log(varKey + "   " + varChar);
    } else {
        varChar = 0;
    }

    return varChar;
}


/*
Statistics operation for calculating typing statistics
Gross WPM, Net WPM, Accuracy and Errors
Called canvas function to draw graph representation
 */
function Statistics(typedEntries, errNr) {
    let txt = document.getElementById("txtarea").value;
    let sumTotal = txt.length;
    var grosTag = document.getElementById("gross");
    var accurTag = document.getElementById("accuracy");
    var netTag = document.getElementById("net");
    var errTag = document.getElementById("errors");
    //Timer
    var stopT = new Date().getTime();
    var startT = getCharFSession("timeMsec");
    var timer = msecToMin(stopT - startT);
    var gros = 0;

    var cArr = [0, 0];
    if (typedEntries > 0) {
        let accur = ((typedEntries - errNr) / typedEntries) * 100;
        accurTag.textContent = Math.round(accur) + "%";
        if (timer !== 0.00) {

            gros = (typedEntries / 5) / timer;
            let net = (gros) - (errNr / timer);
            grosTag.textContent = Math.round(gros);
            netTag.textContent = Math.round(net);
        }

    }
    if (errNr > 0) {
        errTag.textContent = errNr;
    }

    // Representation coordinates in canvas
    var xRadius = Math.round((275 * typedEntries) / sumTotal);
    var yRadius = 0;
    var oldGros = getCharFSession("gresK");
    if (gros !== "undefined") {
        if (gros < oldGros) {
            yRadius = -20;
        } else if (gros > oldGros) {
            yRadius = 25;
        } else {
            yRadius = 0;
        }
    }

    if (xRadius !== "undefined" && yRadius !== "undefined") {
        cArr.push([xRadius, yRadius]);
        drawCanvas(cArr);
    }

    if (gros !== "undefined" && gros !== null) {
        console.log(" gross " + gros);
        setSessionCharNr("gresK", gros);
    }
}

// converting Time to minutes
function msecToMin(msec) {
    var minutes = Math.round(msec * 100) / 60000;
    return Math.round(minutes) / 100;
}

// Canvas To draw representation speed typing
function drawCanvas(coordArr) {
    var canvas = document.getElementById("canvaId");
    var ctx = canvas.getContext("2d");

// declare graph start and end
    var graph_Top = 5;
    var graph_Bottom = 140;
    var graph_Left = 5;
    var graph_Right = 280;
    var gph_Height = 145;
    //var gph_Width = 280;

    ctx.clearRect(0, 0, 280, 140);// clear canvas

// draw reference line at the left
    ctx.beginPath();
    ctx.moveTo(graph_Left, graph_Bottom);
    ctx.lineTo(graph_Right, graph_Bottom);
    ctx.lineTo(graph_Right, graph_Top);
    ctx.stroke();

// draw reference line at the top
    ctx.beginPath();
    ctx.strokeStyle = "#BBB";
    ctx.moveTo(graph_Left, graph_Top);
    ctx.lineTo(graph_Left, graph_Bottom);
    ctx.stroke();

    // set light grey color for reference lines
    ctx.beginPath();
    ctx.strokeStyle = "#BBB";
    ctx.moveTo(graph_Left, graph_Top);
    ctx.lineTo(graph_Right, graph_Top);
    ctx.stroke();

// draw reference line 3/4 up from the bottom
    ctx.beginPath();
    ctx.moveTo(graph_Left, (gph_Height) / 4 * 3 + graph_Top);
    ctx.lineTo(graph_Right, (gph_Height) / 4 * 3 + graph_Top);
    ctx.stroke();

// draw reference line 1/2 way up
    ctx.beginPath();
    ctx.moveTo(graph_Left, (gph_Height) / 2 + graph_Top);
    ctx.lineTo(graph_Right, (gph_Height) / 2 + graph_Top);
    ctx.stroke();

// draw reference line 1/4 up from the bottom
    ctx.beginPath();
    ctx.moveTo(graph_Left, (gph_Height) / 4 + graph_Top);
    ctx.lineTo(graph_Right, (gph_Height) / 4 + graph_Top);
    ctx.stroke();

    if (coordArr !== "undefined") {
        ctx.beginPath();
        ctx.strokeStyle = "#ff4500";
        var y = ((gph_Height) / 4 * 3 + graph_Top);
        ctx.moveTo(graph_Left, y);
        for (let j = 0; j < coordArr.length; j++) {
            ctx.lineTo(graph_Left + coordArr[j][0], y - coordArr[j][1]);
            // ctx.arc(graph_Left + coordArr[j][0], y - coordArr[j][1],3,0, Math.PI*2, true);
        }
        ctx.stroke();
    }
}

function audi() {
    var audio = new Audio();
    audio.src = "../audio/ComputerError.mp3";
    audio.type = 'audio/mpeg';
    var playPromise = audio.play();
}


//===================================================================================================
var stxt1 = ['Pär Lagerkvists', 'Min älskade', 'Min älskade kommer inte åter, men min kärlek kommer åter till mig. Det jag levat kommer inte åter, men mitt liv är åter hos mig. Barn som jag smekt med händer, varma av morgonsol, aldrig du återvänder, aldrig blir åter sol. Åter blir sol i världen, men en annan än den som var. Morgon som återvänder, blott jag som vill värmas är kvar. Ingenting får störa vår stund med varandra, inga vindar blåsa, inga skyar gå. Allt skall vara som den gången som jag minnes, hela jorden stråla allt så som jag minnes, blott icke så som då. lilla hand av mitt eget hjärta.'];
var stxt2 = ["Pär Lagerkvists", "Det kom ett brev", "Det kom ett brev om sommarsäd, om vinbärsbuskar, körsbärsträd, ett brev ifrån min gamla mor med skrift så darrhänt stor.  Ord intill ord stod klöveräng och mogen råg och blomstersäng, och Han som över allting rår från år till år.  Där låg i solen gård vid gård inunder Herrens trygga vård, och klara klockor ringde fred till jorden ned."];
var stxt3 = ["Fem hjärtan", "Hoppets fackla", "Livet var en stund ett stjärnregnande fyrverkeri och ett oändligt lustfyllt hav vi fångade kometer med våra hjärtan så att de aldrig skulle slockna våra ögon tindrade och bländade oss likt små lysande solar Det var en stund men som alltid...."];

var etxt1 = ["T. S. Eliot", "The Waste Land", "The Chair she sat in, like a burnished throne,Glowed on the marble, where the glass held up by standards wrought with fruited vines from which a golden Cupidon peeped out. Doubled the flames of sevenbranched candelabra reflecting light upon the table as The glitter of her jewels rose to meet it, From satin cases poured in rich profusion; The change of Philomel. Jug Jug to dirty ears. And other withered stumps of time were told upon the walls; staring forms " +
"Leaned out, leaning, hushing the room enclosed. Footsteps shuffled on the stair. Under the firelight, under the brush, her hair. Spread out in fiery points. Glowed into words, then would be savagely still."];
var etxt2 = ["Carl Solomon", "Howl", "I saw the best minds of my generation destroyed by madness, starving hysterical naked, dragging themselves hrough the negro streets at dawn looking for an angry fix, who poverty and tatters and hollow-eyed and high sat up smoking in the supernatural darkness of cold-water flats floating across the tops of cities contemplating jazz, " +
"who bared their brains to Heaven under the El and saw Mohammedan angels staggering on tenement roofs illuminated, burning their money in wastebaskets and listening to the Terror through the wall"];
var etxt3 = ["Marianne Moore", "Poetry", "I too, dislike it: there are things that are important beyond all this fiddle. Reading it, however, one discovers that there is in it after all, a place for the genuine. Hands that can grasp, eyes that can dilate, hair that can rise if it must, when they become so derivative as to become unintelligible. The bat, holding on upside down or in quest of something to eat, a wild horse taking a roll, the base-" +
"ball fan; when dragged into prominence by half poets, the result is not poetry."];
//===========================================================================
