<html>
<head>
<link rel="shortcut icon" href="http://biosector01.com/favicon.ico" />
<title>BIONICLEsector01</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0797B0">
<style type="text/css">
@font-face {
        font-family: 'GoudyTrajan';
        src: url('http://biosetor01.com/resources/goudytrajan-webfont.eot');
        src: url('http://biosector01.com/resources/goudytrajan-webfont.eot?#iefix') format('embedded-opentype'),
        url('http://biosector01.com/resources/goudytrajan-webfont.woff') format('woff'),
        url('http://biosector01.com/resources/GoudyTrajan.ttf') format('truetype'),
        url('http://biosector01.com/resources/goudytrajan-webfont.svg#goudytrajanregular') format('svg');
        font-style: normal;
}

* {
        padding: 0;
        margin: 0;
}

body {
        background: #a8dae3 url('http://biosector01.com/wiki/skins/MonoBook/bgbio2015.jpg') no-repeat center center fixed !important;
        background-attachment: fixed !important;
        background-size: cover !important;
        text-align: center;
        height: 100%;
}

input[type="text"] {
        width: 500px;
        background-color: #f9f9f9;
        border: 1px solid #eaeaea;
        border-radius: 4px;
        padding: 11px 10px 9px;
        font-size: 1.5em;
        font-family: "GoudyTrajan", serif;
}

input[type="submit"] {
        background-image: url('https://www.harrellsecurities.com/owncloud/core/img/actions/confirm.svg');
        background-repeat: no-repeat;
        background-position: center center;
        background-color: transparent;
        opacity: .3;
        width: 40px;
        height: 40px;
        border: 0;
        position: relative;
        top: -43px;
        left: 230px;
        cursor: pointer;
}

input[type="submit"]:hover {
        opacity: .7;
}

/* Desktop only */
@media screen and (min-device-width: 480px) {
        #content {
                position: relative;
                top: 40%;
                transform: translateY(-60%);
                -webkit-transform: translateY(-60%);
                -ms-transform: translateY(-60%);
        }
}

/* Mobile only */
@media screen and (max-device-width: 480px) {
        #content {
                position: relative;
                top: 2em;
        }

        img {
                max-width: 300px;
        }

        input[type="text"] {
                width: 400px;
        }

        input[type="submit"] {
                left: 180px;
        }
}
</style>
</head>
<body>
<div id="content">
<a href="/wiki/index.php/Main_Page">
<img src="http://biosector01.com/images/FinalLogoNewHR.png" width="400" alt="BS01 Logo" />
</a>
<form action="search.php" method="get">
<input type="text" name="query" placeholder="Search" value autofocus><br />
<input type="submit" value>
<input type="hidden" name="search" value="1">
</form>
</div>
</body>
</html>
