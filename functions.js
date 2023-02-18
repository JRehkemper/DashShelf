

/* Check if Browser is Firefox or Chrome */
function checkBrowserType() {
    if (navigator.userAgent.includes("Firefox")) {
        browser = "firefox";
    }
    else if (navigator.userAgent.includes("Chrome")) {
        browser = "chrome"
    }
    return browser
}

/* Read BookmarksTree */
async function readBookmarksFile() {
    return await chrome.bookmarks.getTree();
}

/* Display Date on Dashboard */
function displayDate() {
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    var dow = date.getDay()
    var dayOfWeek = "";
    /* Switch to convert Number to String to display Day of the week */
    switch(dow) {
        case 1:
            dayOfWeek = "Monday"
            break;
        case 2:
            dayOfWeek = "Tuesday"
            break;
        case 3:
            dayOfWeek = "Wednesday"
            break;
        case 4:
            dayOfWeek = "Thursday"
            break;
        case 5:
            dayOfWeek = "Friday"
            break;
        case 6:
            dayOfWeek = "Saturday"
            break;
        case 7:
            dayOfWeek = "Sunday"
            break;
    }
    /* Switch to convert number to String to display Month */
    var monthString = ""
    switch(month) {
        case 0:
            monthString = "January"
            break;
        case 1:
            monthString = "February"
            break;
        case 2:
            monthString = "March"
            break;
        case 3:
            monthString = "April"
            break;
        case 4:
            monthString = "May"
            break;
        case 5:
            monthString = "June"
            break;
        case 6:
            monthString = "July"
            break;
        case 7:
            monthString = "August"
            break;
        case 8:
            monthString = "September"
            break;
        case 9:
            monthString = "October"
            break;
        case 10:
            monthString = "November"
            break;
        case 11:
            monthString = "December"
            break;
    }
    /* Insert Date into HTML */
    var dateString = dayOfWeek+" "+day+". "+monthString+" "+year
    document.getElementById("date").innerHTML+= dateString
}

/* Functionality for "Save Width" Button -> Set Width of cards to Browser Storage */
function setWidthOfCards() {
    document.getElementById("save-width").addEventListener('click', saveWidth)
    try {
        chrome.storage.sync.get(["width"], function(result) {
            console.log('Width loaded is ' + result.width);
            const root = document.documentElement
            root.style.setProperty("--width", result.width)
            document.getElementById("slider").value = result.width.replace("px", "")
        });
    }
    catch {
        console.log("Couldn't load old width,")
        document.getElementById("slider").value = "350px"
    }
}

/* 
 * Function to Save Width to Browser Storage
 * Called By setWidthOfCards()
 */
function saveWidth() {
    width = document.getElementById("slider").value+"px"
    //console.log(width)
    chrome.storage.sync.set({"width": width}, function() {
        console.log('Width is set to ' + width);
    });
    alert("Width successfully saved")
}

/* Listener for Width Slider */
function createListenerOnWidthSlider() {
    const slider = document.getElementById("slider");
    slider.addEventListener("input", function(e) {
        const root = document.documentElement
        root.style.setProperty("--width", e.target.value+"px")
    })
}

/* TODO: Figure out what I'm doing here... */
/* TODO: Firefox and Chrome do save in different structures. You will need to equalize them */
function processBookmarksForChrome() {
    var bookmarkArr = bookmarksFile[0]["children"][0]["children"]
    var bookmarksList = []
    var unsortedBookmarks = []
    for(var i = 0; i < bookmarkArr.length; i++) {
        if(typeof bookmarkArr[i]["children"] != 'undefined') {
            bookmarksList.push(bookmarkArr[i])
        }
        else {
            unsortedBookmarks.push(bookmarkArr[i])
        }
    }
    var numberOfDirs = bookmarksList.length
    for (let i = 0; i < numberOfDirs; i++) {
        addElements(bookmarksList[i], i);
    }
    if(unsortedBookmarks.length > 0) {
        document.getElementById("bookmarks").innerHTML += `
            <div class="directory" id="directory-unsorted">
                <h2 class="directory-title">Unsorted Bookmarks</h2>
            </div>`
        addUnsortedElements(unsortedBookmarks)
    }
}

/* Add Element From Folder to HTML */
function addElements(elements, elementIndex) {
    var children = elements["children"]
    
    // Add HTML Code
    document.getElementById("bookmarks").innerHTML += `
    <div class="directory" id="directory${elementIndex}">
    <h2 class="directory-title">${elements["title"]}</h2>
    </div>
    `
    
    for (let i = 0; i < children.length; i++){
        var favicon = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(children[i]["url"])}&size=32`;
        document.getElementById("directory"+elementIndex).innerHTML += `
            <a class="card-title" href=${children[i]["url"]} target="_blank">    
                <div class="card">
                    <div class="thumbnail-div">
                        <img class="thumbnail" src="${favicon}">
                        <!--<div class="bookmark-icon"></div>-->
                    </div>
                    <div class="card-title-div">
                        ${children[i]["title"]}
                    </div>           
                </div>
            </a> 
        `
    }
}

/* Add Element that is not in a Folder to HTML */
function addUnsortedElements(elements) {
    for (var i = 0; i < elements.length; i++) {
        var favicon = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(elements[i]["url"])}&size=32`;
        document.getElementById("directory-unsorted").innerHTML += `
            <a class="card-title" href="${elements[i]["url"]}" target="_blank">
                <div class="card">
                    <div class="thumbnail-div">
                        <img class="thumbnail" src="${favicon}">
                        <!--<div class="bookmark-icon"></div>-->
                    </div>
                    <div class="card-title-div">
                        ${elements[i]["title"]}
                    </div>
                </div>
            </a>
        `
    }
}

/* process Bookmarks for Firefox or Chrome */
function processBookmarks() {
    if (browser == "firefox") {
        processBookmarksForFirefox()
    }
    else if (browser == "chrome") {
        processBookmarksForChrome()
    }
}

/* Test Function for Debugging */
function test() {

}

function processBookmarksForFirefox() {
    /* Get Bookmarks from Bookmark list. Every Bookmark or Folder is an object */
    var bookmarkArr = bookmarksFile[0]["children"][1]["children"]
    var unsortedBookmarks = []
    var bookmarkFolders = []
    for (var i = 0; i < bookmarkArr.length; i++) {
        if (bookmarkArr[i].type == "bookmark") {
            unsortedBookmarks.push(bookmarkArr[i])
        }
        else if (bookmarkArr[i].type == "folder") {
            bookmarkFolders.push(bookmarkArr[i])
        }
    }
    /* Add Folder of Bookmarks */
    for (var i = 0; i < bookmarkFolders.length; i++)
    {
        addElements(bookmarkFolders[i], i)
    }

    /* Add all bookmarks that are not in a folder */
    if(unsortedBookmarks.length > 0) {
        document.getElementById("bookmarks").innerHTML += `
            <div class="directory" id="directory-unsorted">
                <h2 class="directory-title">Unsorted Bookmarks</h2>
            </div>`
        addUnsortedElements(unsortedBookmarks)
    }

}


var browser = null;
var bookmarksFile;

async function main() {
    browser = checkBrowserType()
    bookmarksFile = await readBookmarksFile()
    displayDate()
    setWidthOfCards()
    createListenerOnWidthSlider()
    processBookmarks()
}

main()