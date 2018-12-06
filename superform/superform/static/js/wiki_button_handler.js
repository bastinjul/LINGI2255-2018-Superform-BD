/*  Copyright 2004-2015 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This file provides Javascript functions to support WYSIWYG-style
    editing.  The concepts are borrowed from the editor used in Wikipedia,
    but the code has been rewritten from scratch to integrate better with
    PHP and PmWiki's codebase.
    
    Script maintained by Petko Yotov www.pmwiki.org/petko
*/

function previewFunction() {
    let tid = arguments[0].id;

    let text_area = document.getElementById(tid);

    let div_preview = document.createElement('div');
    div_preview.setAttribute("class", 'form-group');
    div_preview.setAttribute("id", "div_preview");

    let labelpreview = document.createElement('label');
    labelpreview.setAttribute("id","previewLabel");
    labelpreview.innerText = "Preview";
    labelpreview.setAttribute("for", "text_area_preview");

    let text_area_preview = document.createElement('textarea');
    text_area_preview.setAttribute("readonly","true");
    text_area_preview.setAttribute("id", "text_area_preview");
    text_area_preview.setAttribute("class", "form-control");
    text_area_preview.setAttribute("rows", "5");

    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    }, false;

    div_preview.appendAfter(text_area.parentElement);
    div_preview.appendChild(labelpreview);
    div_preview.appendChild(text_area_preview);

    text_area.onkeyup = text_area.onkeypress = function(){document.getElementById('text_area_preview').value = interpreter(this.value);};
}

function interpreter(str) {
    let old_string = str;
    let new_string = str;
    do{
        old_string = new_string;
        new_string = old_string.replace(/''''''/, "</br><br>" );
    }while(old_string!=new_string);

    let res = new_string.replace(/\n/g,"\n");

    res = replace_link1(res);
    res = replace_link2(res);

    res = res.replace(/'''/g,"");
    res = res.replace(/''/g," ");
    res = replace_big1(res);
    res = replace_big2(res);
    res = replace_small1(res);
    res = replace_small2(res);
    res = replace_sub1(res);
    res = replace_sub2(res);
    res = replace_exp1(res);
    res = replace_exp2(res);
    res = res.replace(/!!/g," ");
    res = replace_center(res);

    return res;
}

function replace_link1(str){
    let str2 = "<a class=\"urllink\">";
    return str.replace(/\[\[/g,str2);
}

function replace_link2(str){
    let str2 = "</a>";
    return str.replace(/]]/g,str2);
}

function replace_big1(str) {
    let str2 = "<big>";
    return str.replace(/'\+/g,str2);
}

function replace_big2(str) {
    let str2 = "</big>";
    return str.replace(/\+'/g,str2);
}

function replace_small1(str) {
    let str2 = "<small>";
    return str.replace(/'-/g,str2);
}

function replace_small2(str) {
    let str2 = "</small>";
    return str.replace(/-'/g,str2);
}

function replace_exp1(str) {
    let str2 = "<sup>";
    return str.replace(/'\^/g,str2);
}

function replace_exp2(str) {
    let str2 = "</sup>";
    return str.replace(/\^'/g,str2);
}

function replace_sub1(str) {
    let str2 = "<sub>";
    return str.replace(/'_/g,str2);
}

function replace_sub2(str) {
    let str2 = "</sub>";
    return str.replace(/_'/g,str2);
}

function replace_heading(str) {
    let str2 = "</sub>";
    return str.replace(/_'/g,str2);
}

function replace_center(str) {
    var pos1 = str.indexOf("%");           // 3
    var pos2 = str.indexOf("%", pos1 + 1);
    var i = pos2 - pos1 - 1;

    var str2 = str.substring(0, pos1) + "<center>" + str.substring(pos2+1);

    pos1 = str2.indexOf("%");

    return str2.substring(0, pos1) + "</center>" + str2.substring(pos2+1);
}

function insButton(mopen, mclose, mtext, mlabel, mkey) {
    console.log("insButton");
    if (mkey > '') { mkey = 'accesskey="' + mkey + '" ' }
    document.write("<a tabindex='-1' " + mkey + "onclick=\"insMarkup('"
        + mopen + "','"
        + mclose + "','"
        + mtext + "');\">"
        + mlabel + "</a>");
}

function insMarkup() {
    var func = false, tid='wiki_descriptionpost', mopen = '', mclose = '', mtext = '';
    if(typeof arguments[0] == 'function') {
        var func = arguments[0];
        if(arguments.length > 1) tid = arguments[1];
        mtext = func('');
    }
    else if (arguments.length >= 3) {
        var mopen = arguments[0], mclose = arguments[1], mtext = arguments[2];
        if(arguments.length > 3) {
            tid = arguments[3];
            tid = tid.id;
        }
    }

    var tarea = document.getElementById(tid);

    if (tarea.setSelectionRange > '') {
        var p0 = tarea.selectionStart;
        var p1 = tarea.selectionEnd;
        var top = tarea.scrollTop;
        var str = mtext;
        var cur0 = p0 + mopen.length;
        var cur1 = p0 + mopen.length + str.length;
        while (p1 > p0 && tarea.value.substring(p1-1, p1) == ' ') p1--;
        if (p1 > p0) {
            str = tarea.value.substring(p0, p1);
            if(func) str = func(str);
            cur0 = p0 + mopen.length + str.length + mclose.length;
            cur1 = cur0;
        }
        tarea.value = tarea.value.substring(0,p0)
            + mopen + str + mclose
            + tarea.value.substring(p1);
        tarea.focus();
        tarea.selectionStart = cur0;
        tarea.selectionEnd = cur1;
        tarea.scrollTop = top;
    } else if (document.selection) {
        var str = document.selection.createRange().text;
        tarea.focus();
        let range = document.selection.createRange();
        if (str == '') {
            range.text = mopen + mtext + mclose;
            range.moveStart('character', -mclose.length - mtext.length );
            range.moveEnd('character', -mclose.length );
        } else {
            if (str.charAt(str.length - 1) == " ") {
                mclose = mclose + " ";
                str = str.substr(0, str.length - 1);
                if(func) str = func(str);
            }
            range.text = mopen + str + mclose;
        }
        range.select();
    } else { tarea.value += mopen + mtext + mclose; }
    return;
}


