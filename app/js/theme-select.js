"use strict";

var _themeSelect = (function()
{
    var init = function()
    {
        var themeSelects = document.getElementsByClassName('theme-select');

        if (themeSelects){
            themeSelects[0].children[0].addEventListener('change', changeTheme);
        }
    }

    var changeTheme =  function(e) {
      document.body.className = 'theme theme-' + e.target.value;
    }

    return {
        init: init
    };
})();
