getBackgroundData();
getUserInfo();
var searchSuggestions = new MWSearchSuggestions({"wiki": "../../wiki/"});

document.getElementById("sidebar-opener").addEventListener("click", function() {
  document.body.classList.toggle("sidebar-open"); //IE 10+
});
document.getElementById("fade-overlay").addEventListener("click", function() {
  document.body.classList.remove("sidebar-open"); //IE 10+
});
document.getElementById("sidebar-closer").addEventListener("click", function() {
  document.body.classList.remove("sidebar-open"); //IE 10+
});
