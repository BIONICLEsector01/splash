var parser = new DOMParser();

function getBackgroundData() {
  var backgroundApiCall = new XMLHttpRequest();
  backgroundApiCall.onreadystatechange = function() {
      if (backgroundApiCall.readyState == 4 && backgroundApiCall.status == 200) {
        //See https://stackoverflow.com/q/40729785
        var apiTextAsXml = parser.parseFromString(backgroundApiCall.responseText, "text/xml");
        setPageInfo(apiTextAsXml);
      }
  };

  //We used to do the below, but as of June 8, 2017, Yahoo has ended the service used. Now we
  //get the page's raw text and parse it locally ourselves, in case this sort of thing happens
  //again. See https://stackoverflow.com/a/44464349

  //When the GET request pulls from biosector01.com itself, the resulting XML is cut off in
  //the middle, so it has the beginning, an ellipsis, then the end. This isn't usable here.
  //Perhaps the server is configured so that biosector01.com can only make GET requests to
  //biosector01.com under a certain size. Anyway, a workaround is that instead of requesting
  //the HTML directly, we let Yahoo! Query Language do the work for us. It'll make the original
  //request for us, then we can pull the page from Yahoo instead of from biosector01.com.
  //Then the whole page shows up here as desired. Problem solved. Credit to Derek Gathright
  //on StackOverflow: http://stackoverflow.com/a/2679304
  backgroundApiCall.open("GET", "http://biosector01.com/wiki/index.php?title=BIONICLEsector01:Splash&action=render", true);
  backgroundApiCall.send();
}

function setPageInfo(response) {
  var nodes = response.getElementsByTagName("div"),
      featuredNodes = [],
      backgroundNodes = [];
  //figure out whether each node is a featured node or a background node
  for (i = 0; i < nodes.length; i++) {
    if (featuredNodes.length < 2 && nodes[i].getAttribute("class") == "featured-node") {
      //there can only be two featured nodes because there are only two customizable featured boxes
      featuredNodes.push(nodes[i]);
    } else if (nodes[i].getAttribute("class") == "background-node") {
      backgroundNodes.push(nodes[i]);
    } //else if the class is "splash-content" do nothing with it
  }
  if (backgroundNodes.length > 0) {
    setBackground(backgroundNodes);
  }
  if (featuredNodes.length > 0) {
    setFeatured(featuredNodes);
  }
}

function setBackground(nodes) {
  var imageElement = document.getElementById("background-image"),
      exploreLinkElement = document.getElementById("explore-link"),
      exploreLinkNameElement = document.getElementById("explore-name"),
      gradientElement = document.getElementById("main-gradient");

  //Figure out which node to use.
  //The number of nodes is at least 1, thanks to the setPageInfo() function.
  //This means we can start processing knowing there's at least one background to do.
  var numberOfNodes = nodes.length;
  //pick random number between 1 and numberOfNodes (both inclusive)
  var randomNode = Math.floor(Math.random() * (numberOfNodes)) + 1;
  //the node count starts at 0, so subtract 1 from randomNode to get the node we want
  var nodeToUse = nodes[randomNode - 1];

  //Go through all the subnodes and set the box's contents as appropriate.
  //The 2 required subnodes are category, image, and link.
  var imageAdded = false,
      linkAdded = false,
      gradientAdded = false;
  //store the background image until we're done iterating, since it should stay hidden
  //until we've determined there's an image and a link provided. Also it'll stop the image
  //from changing multiple times if there are multiple image nodes.
  var subnode = null;
  var backgroundImage = "./img/bgbio2015gradient.jpg",
      color1 = null,
      color2 = null;
  for (i = 0; i < nodeToUse.childElementCount; i++) {
    subnode = nodeToUse.childNodes[i];
    switch (subnode.getAttribute("class")) {
      case "image":
        //store the href of the anchor in the "image" subnode
        backgroundImage = subnode.firstChild.getAttribute("href");
        imageAdded = true;
        break;
      case "link":
        //set the explore link's href to the href of the anchor in the "link" subnode
        exploreLinkElement.href = subnode.firstChild.getAttribute("href");
        //set the explore link's text to the text of the anchor in the "link" subnode
        exploreLinkNameElement.textContent = subnode.firstChild.firstChild.nodeValue;
        linkAdded = true;
        break;
      case "gradient":
        //if there are not exactly two subnodes (one for each color) in this subnode, don't do anything to the gradient
        if (subnode.childElementCount !== 2) {
          break;
        }
        //get the colors for the background gradient
        color1 = subnode.firstChild.firstChild.nodeValue;
        color2 = subnode.firstChild.nextSibling.firstChild.nodeValue;
        //set the box's background gradient colors to the values we just got
        gradientAdded = true;
        break;
    }
  }
  var backgroundImageContainer = new Image();
  backgroundImageContainer.src = backgroundImage;
  //set the background image after it's been loaded, so it doesn't appear while it's loading
  backgroundImageContainer.onload = function() {
    imageElement.style.backgroundImage = "url(" + backgroundImage + ")";
    imageElement.style.opacity = 1;
    if (imageAdded && linkAdded) {
      //if all required subnodes were provided (which also means we're not using the default image)
      exploreLinkElement.style.visibility = "visible";
    }
    if (imageAdded && gradientAdded) {
      //if an image and a gradient were both provided
      gradientElement.setAttribute("style",
                                   "background-color: " + color1 + ";" +
                                   "background-image: -webkit-linear-gradient(135deg, " + color1 + ", " + color2 + ");" +
                                   "background-image: -moz-linear-gradient(135deg, " + color1 + ", " + color2 + ");" +
                                   "background-image: linear-gradient(135deg, " + color1 + ", " + color2 + ");"
                                  );
    }
  };
}

function setFeatured(nodes) {
  //The number of nodes is either 1 or 2, thanks to the setPageInfo() function.
  //This means we can start processing knowing there's at least one box to do.
  processFeaturedNode(nodes[0], "left");
  if (nodes.length == 2) {
    processFeaturedNode(nodes[1], "right");
  }
}

function processFeaturedNode(node, side) {
  var boxElement = document.getElementById("box-" + side),
      linkElement = document.getElementById("link-" + side),
      categoryElement = document.getElementById("category-" + side),
      titleElement = document.getElementById("title-" + side),
      subtitleElement = document.getElementById("subtitle-" + side),
      gradientElement = document.getElementById("gradient-" + side);

  //Go through all the subnodes and set the box's contents as appropriate.
  //The 3 required subnodes are category, image, and link.
  var categoryAdded = false,
      imageAdded = false,
      linkAdded = false,
      colorAdded = false;
  var subnode = null;
  var backgroundImage = null,
      color = null;
  for (i = 0; i < node.childElementCount; i++) {
    subnode = node.childNodes[i];
    switch (subnode.getAttribute("class")) {
      case "category":
        //set the box's category text (i.e., text on top) to the text in the "category" subnode
        categoryElement.textContent = subnode.firstChild.textContent;
        categoryAdded = true;
        break;
      case "image":
        //store the href of the anchor in the "image" subnode
        backgroundImage = subnode.firstChild.getAttribute("href");
        imageAdded = true;
        break;
      case "link":
        //set the box link's href to the href of the anchor in the "link" subnode
        linkElement.href = subnode.firstChild.getAttribute("href");
        //set the box's title text (i.e., text above the image) to the text of the anchor in the "link" subnode
        titleElement.textContent = subnode.firstChild.firstChild.nodeValue;
        linkAdded = true;
        break;
      case "subtitle":
        //set the box's subtitle text (i.e., smaller text below title text) to the text in the "subtitle" subnode
        subtitleElement.textContent = subnode.firstChild.textContent;
        break;
      case "color":
        //get the color for the background
        color = subnode.firstChild.nodeValue;
        //set the box's background gradient colors to the values we just got
        colorAdded = true;
        break;
    }
  }
  if (imageAdded && categoryAdded && linkAdded) {
    //if all required subnodes were provided
    var backgroundImageContainer = new Image();
    backgroundImageContainer.src = backgroundImage;
    //set the background image after it's been loaded, so it doesn't appear while it's loading
    backgroundImageContainer.onload = function() {
      boxElement.style.backgroundImage = "url(" + backgroundImage + ")";
      boxElement.style.opacity = 1;
      if (imageAdded && colorAdded) {
        //if an image and a gradient were both provided
        gradientElement.setAttribute("style",
                                     "background-image: -webkit-linear-gradient(" + color + ", #000 90%);" +
                                     "background-image: -moz-linear-gradient(" + color + ", #000 90%);" +
                                     "background-image: linear-gradient(" + color + ", #000 90%);"
                                   );
      }
      linkElement.style.visibility = "visible";
      linkElement.style.opacity = 1;
    };
  }
}
