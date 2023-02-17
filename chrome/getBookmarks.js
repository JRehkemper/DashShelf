var bookmarksFile

chrome.bookmarks.getTree(function(tree) {
    bookmarksFile = tree;
})


