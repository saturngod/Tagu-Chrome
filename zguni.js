var regexMM = new RegExp("[\u1000-\u109f\uaa60-\uaa7f]+");
var regexUni = new RegExp("[ဃငဆဇဈဉညဋဌဍဎဏဒဓနဘရဝဟဠအ]်|ျ[က-အ]ါ|ျ[ါ-း]|\u103e|\u103f|\u1031[^\u1000-\u1021\u103b\u1040\u106a\u106b\u107e-\u1084\u108f\u1090]|\u1031$|\u1031[က-အ]\u1032|\u1025\u102f|\u103c\u103d[\u1000-\u1001]|ည်း|ျင်း|င်|န်း|ျာ|င့်");
var regexZG = new RegExp("\s\u1031| ေ[က-အ]်|[က-အ]း");
var timerID = undefined;
var mmFonts = new RegExp("Zawgyi-One|Masterpiece Uni Sans|Myanmar3|Yunghkio|Parabaik|WinUni Innwa|Win Uni Innwa|Padauk|MyMyanmar|Panglong|TharLon");
var unicodeFonts = new RegExp("MON3 Anonta 1 | Masterpiece Uni Sans|Myanmar3|Yunghkio|Parabaik|WinUni Innwa|Win Uni Innwa|Padauk|MyMyanmar|Panglong|TharLon|Myanmar Sangam");
var useUnicodeFont = "'MON3 Anonta 1',TharLon,'Masterpiece Uni Sans','Myanmar Sangam MN',Myanmar3,Yunghkio,Parabaik,'WinUni Innwa','Win Uni Innwa',Padauk,Panglong,'MyMyanmar Unicode','Myanmar MN'";

var facebook_wordbreaking_classes = ['messageBody', 'commentBody', 'uiAttachmentTitle', 'uiAttachmentDesc', 'ministoryInlineMessage', 'msg'];

var dummySpanEl = document.createElement('span');
dummySpanEl.style.fontFamily = useUnicodeFont;
useUnicodeFont = dummySpanEl.style.fontFamily;

var tagPage = function()
{
    for (var i = 0; i < facebook_wordbreaking_classes.length; i++) {
        var els = document.getElementsByClassName(facebook_wordbreaking_classes[i])
        for (var j = 0; j < els.length; j++) {
            var thisNode = els[j];
            var text = thisNode.textContent;
        
            if (!regexMM.test(text)) {
                continue;
            }
        
            var computedStyles = document.defaultView.getComputedStyle(thisNode, null);
        
            if (computedStyles.fontFamily.indexOf(useUnicodeFont) == -1 && unicodeFonts.test(computedStyles.fontFamily)) {
                thisNode.style.fontFamily = computedStyles.fontFamily + "," + useUnicodeFont;
                continue;
            }
        
            if (mmFonts.test(computedStyles.fontFamily)) {
                continue;
            }
        
            if (regexUni.test(text) && !regexZG.test(text)) {
                thisNode.style.fontFamily = computedStyles.fontFamily + "," + useUnicodeFont;
            } else {
                thisNode.style.fontFamily = computedStyles.fontFamily + "," + "Zawgyi-One";
            }
        }
    }
    
    var el = document.getElementsByTagName('*');
     for (var i = 0; i < el.length; i++)
     {
         var childs = el[i].childNodes;
         for (var j = 0; j < childs.length; j++)
         {
             var thisNode = childs[j];
             if (thisNode.nodeType == 3) {
    
                 var prNode = thisNode.parentNode;
                 var text = thisNode.textContent;
    
                 if (!regexMM.test(text)) {
                     continue;
                 }
                 
                 var computedStyles = document.defaultView.getComputedStyle(prNode, null);
                 
                 if (computedStyles.fontFamily.indexOf(useUnicodeFont) == -1 && unicodeFonts.test(computedStyles.fontFamily)) {
                     prNode.style.fontFamily = useUnicodeFont;
                     continue;
                 }
                 
                 if (mmFonts.test(computedStyles.fontFamily)) {
                     continue;
                 }
                 
                 var nextNode = thisNode;
                    while (nextNode.nextSibling) {
                        nextNode = nextNode.nextSibling;
                        text += nextNode.textContent;
                    }
                    
                    if (text) {
                        if (regexUni.test(text) && !regexZG.test(text)) {
                            prNode.style.fontFamily = computedStyles.fontFamily + "," + useUnicodeFont;
                        } else {
                            prNode.style.fontFamily = computedStyles.fontFamily + "," + "Zawgyi-One";
                        }
                    }
             }
         }
     }
}

//create font face CSS Unicode
var styleNode           = document.createElement ("style");
styleNode.type          = "text/css";
styleNode.textContent   = "@font-face { font-family: 'MON3 Anonta 1'; src: local('MON3 Anonta 1'),url('"
                        + chrome.extension.getURL ("fonts/mon3.ttf")
                        + "'); }"
                        ;
document.head.appendChild (styleNode);

//create font face CSS Zawgyi
var styleNode           = document.createElement ("style");
styleNode.type          = "text/css";
styleNode.textContent   = "@font-face { font-family: 'Zawgyi-One'; src: local('Zawgyi-One'),url('"
                        + chrome.extension.getURL ("fonts/zawgyi.ttf")
                        + "'); }"
                        ;
document.head.appendChild (styleNode);

tagPage();

document.body.addEventListener("DOMNodeInserted", function () {
    if (timerID) {
        clearTimeout(timerID);
    }
    timerID = window.setTimeout(tagPage, 500);
}, false);