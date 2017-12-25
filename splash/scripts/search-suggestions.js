var mostRecentlyUpdatedMWSearchSuggestions = null;

function MWSearchSuggestions(settings) {
  this.wiki = "https://en.wikipedia.org/w/";
  this.searchInputElement = document.getElementById("search-input-query");
  this.suggestionsOutputElement = document.getElementById("search-suggestions");
  this.maxSuggestionCount = 5;
  this.suggestionLinkClass = "search-suggestion-link";
  this.selectedSuggestion = null;
  this.apiCall = null;
  this.apiCallFinished = true;
  if (settings !== undefined) {
    if (settings.hasOwnProperty("wiki")) {
      this.wiki = settings.wiki;
    }
    if (settings.hasOwnProperty("searchInputElement")) {
      this.searchInputElement = settings.searchInputElement;
    }
    if (settings.hasOwnProperty("suggestionsOutputElement")) {
      this.suggestionsOutputElement = settings.suggestionsOutputElement;
    }
    if (settings.hasOwnProperty("maxSuggestionCount")) {
      this.maxSuggestionCount = settings.maxSuggestionCount;
    }
    if (settings.hasOwnProperty("suggestionLinkClass")) {
      this.suggestionLinkClass = settings.suggestionLinkClass;
    }
  }
  //add event listeners
  window.addEventListener("keydown", this, false);
  this.suggestionsOutputElement.addEventListener("mouseover", this, false);
  this.searchInputElement.addEventListener("input", this, false);
}

MWSearchSuggestions.prototype.handleEvent = function(e) {
  var numberOfItems = 0,
      keyDown = false;
  if (e.type === "input") {
    //update the suggestions when there is new input in the search input element
    this.update(this.searchInputElement.value);
  } else if (e.type === "keydown") {
    keyDown = e.keyCode || e.which;
    //get the number of suggestions in the dropdown (between 0 and maxSuggestionCount, both inclusive)
    numberOfItems = this.suggestionsOutputElement.childElementCount;
    if (numberOfItems > 0) {
      //if the up or down arrow is pressed and there is a suggestion selected currently, deselect it
      if ((keyDown === 38 || keyDown === 40) && this.selectedSuggestion !== null) {
        this.selectedSuggestion.classList.remove("selected-suggestion"); //IE 10+
      }
      if (keyDown === 38) {
        //up arrow
        //if no suggestion is selected or the top one is selected
        if (this.selectedSuggestion === null ||
            this.selectedSuggestion === this.suggestionsOutputElement.firstChild) {
          //select the bottom element
          this.selectedSuggestion = this.suggestionsOutputElement.lastChild;
        } else {
          //select the next suggestion up
          this.selectedSuggestion = this.selectedSuggestion.previousSibling;
        }
        //make the selected suggestion look like it's hovered over
        this.selectedSuggestion.classList.add("selected-suggestion"); //IE 10+
      } else if (keyDown === 40) {
        //down arrow
        //if no suggestion is selected or the bottom one is selected
        if (this.selectedSuggestion === null ||
            this.selectedSuggestion === this.suggestionsOutputElement.lastChild) {
          //select the top element
          this.selectedSuggestion = this.suggestionsOutputElement.firstChild;
        } else {
          //select the next suggestion down
          this.selectedSuggestion = this.selectedSuggestion.nextSibling;
        }
        //make the selected suggestion look like it's hovered over
        this.selectedSuggestion.classList.add("selected-suggestion"); //IE 10+
      } else if (keyDown === 13 && document.activeElement === this.searchInputElement && this.selectedSuggestion !== null) {
        //enter key (and the text box is focused, and an item in the dropdown is focused)
        //If enter is pressed when the text box is focused and has text in it, the browser will go to
        //the article in the text box. The browser should go to the selected suggestion instead.
        //Preventing the default action on enter press ensures the former won't happen.
        //Credit to Metax for diagnosing an issue with the original code.
        e.preventDefault();
        this.selectedSuggestion.click();
      }
    }
  } else if (e.type === "mouseover") {
    //hover on the suggestions dropdown
    //if selectedSuggestion isn't null, remove the .selected-suggestion class
    //so it doesn't look like it's hovered over
    if (this.selectedSuggestion !== null) {
      this.selectedSuggestion.classList.remove("selected-suggestion"); //IE 10+
    }
  }
};

MWSearchSuggestions.prototype.update = function(newText) {
  //don't send another API call if the last one hasn't finished yet
  if (!this.apiCallFinished) {
      return;
  }
  //Assign this MWSearchSuggestions object to a global variable. The JSONP callback function does not run
  //in the context of any particular object. We also can't get it to run on this particular object, since
  //we have no way of knowing what var this object is stored in, so we can't pass in the var name into
  //the URL that will cause the callback function to run. Instead, if we store this object in a global
  //variable, the global callback function can perform operations on this particular object.
  mostRecentlyUpdatedMWSearchSuggestions = this;

  //see https://stackoverflow.com/a/2067584, https://stackoverflow.com/a/6879319 for why a script element is used
  this.apiCall = document.createElement("script");
  this.apiCall.src = this.wiki + "api.php?action=opensearch&search=" + newText +
                     "&redirects=resolve&limit=" + this.maxSuggestionCount + "&callback=updateSearchDropdown";
  document.head.appendChild(this.apiCall);
  this.apiCallFinished = false;
};

function updateSearchDropdown(suggestions) {
  //This isn't a prototype function because it's set as the API's callback function, and the API won't
  //be able to call the function on a specific object since it doesn't know any object's name.
  //searchResults[1] contains page titles of suggestions;
  //no greater than this.maxSuggestionCount
  var numberOfSuggestions = suggestions[1].length,
      suggestionTitle = "",
      suggestionLink = "",
      suggestionElement = null;

  //get rid of the script element containing the API call
  document.head.removeChild(mostRecentlyUpdatedMWSearchSuggestions.apiCall);
  mostRecentlyUpdatedMWSearchSuggestions.apiCallFinished = true;
  //empty the suggestions dropdown
  mostRecentlyUpdatedMWSearchSuggestions.suggestionsOutputElement.textContent = "";

  for (var i = 0; i < numberOfSuggestions; i++) {
    //suggestions[1] contains all the page titles, suggestions[3] contains all the links
    suggestionTitle = suggestions[1][i];
    suggestionLink = suggestions[3][i];
    //generate a link to the current suggestion using the title and link data just retrieved,
    //then add it to the suggestions box
    suggestionElement = mostRecentlyUpdatedMWSearchSuggestions.makeSuggestionLink(suggestionTitle, suggestionLink);
    mostRecentlyUpdatedMWSearchSuggestions.suggestionsOutputElement.appendChild(suggestionElement);
  }
  //Reset the variable that points to the most recently updated MWSearchSuggestions object,
  //since all its content has been added already and keeping track of it is no longer necessary
  mostRecentlyUpdatedMWSearchSuggestions = null;
  //reset the selected suggestion
  selectedSuggestion = null;
}

MWSearchSuggestions.prototype.makeSuggestionLink = function(title, link) {
  //create an anchor element with the given title and link
  var searchResultLink = document.createElement("a");
  searchResultLink.href = link;
  searchResultLink.className = this.suggestionLinkClass;
  //note on textContent: https://stackoverflow.com/a/24428100
  searchResultLink.textContent = title;
  return searchResultLink;
};
