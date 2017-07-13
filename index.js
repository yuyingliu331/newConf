$(document).ready(function() {
  var submitIcon = $(".ExpIcon ");
  var submitInput = $(".ExpInput");
  var searchBox = $(".Exp-search");
  var isOpen = false;

  $(document).mouseup(function() {
    if (isOpen == true) {
      submitInput.val("");
      $(".Expbtn").css("z-index", "-999");
      submitIcon.click();
    }
  });
  searchBox.mouseup(function() {
    return false;
  });
  submitIcon.click(function() {
    if (isOpen == false) {
      searchBox.addClass("Exp-search-open");
      isOpen = true;
    } else {
      searchBox.removeClass("Exp-search-open");
      isOpen = false;
    }
  });
});
$(document).ready(function() {
  console.log('hello'); 
  $(".js-example-basic-single").select2();
  
});
$("#channelSelect").select2({
  
  closeOnSelect:false,
  templateResult: function (data) {
    console.log('got in channel?')
    var $res = $('<span></span>');
    var $check = $('<input type="checkbox" />');
    
    $res.text(data.text);
    
    if (data.element) {
      $res.prepend($check);
      $check.prop('checked', data.element.selected);
    }

    return $res;
  }
});

/* resizable table*/
$(function() {
  var thHeight = $("table#filesTable th:first").height();
  $(
    "table#filesTable th:first-child, table#filesTable td:first-child"
  ).resizable({
    handles: "e",
    minHeight: thHeight,
    maxHeight: thHeight,
    minWidth: 40,
    resize: function(event, ui) {
      var sizerID = "#" + $(event.target).attr("id") + "-sizer";
      $(sizerID).width(ui.size.width);
    }
  });
});

$(document).ready(function() {
  jQuery(".scrollbar-dynamic").scrollbar();
  //var calcHeight = FilePanelH();
  $(".files-panel").css("height", FilePanelH);
});

// Popup dHeight

// capture click
$("#fileExplorer").on("shown.bs.modal", function(event) {
  popUpH();
});
$(window).resize(function() {
  popUpH();
});

function popUpH() {
  function popUpHeight() {
    var popupMargins = 80, // 40 + 40 topand bottom margins
      mHeaderH = $(".modal-header").innerHeight(),
      mFooterH = $(".modal-footer").innerHeight();

    //calc
    var calcHeight = window.innerHeight - (popupMargins + mHeaderH + mFooterH);
    return calcHeight;
  }
  $(".modal-body > .dheight")
    .find(".scroll-wrapper.scrollbar-dynamic")
    .css("max-height", popUpHeight);
}

function FilePanelH() {
  var pageMargins = 112, // 40 + 40 topand bottom margins
    ContentPH = $("#Content-Panel").innerHeight(),
    HeaderH = $(".custom-navbar").innerHeight(),
    FooterH = $(".btn-bar").innerHeight();

  //calc
  var calcHeight =
    window.innerHeight - (pageMargins + ContentPH + HeaderH + FooterH);
  return calcHeight;
}
function FilePanelHNew() {
  var pageMargins = 130, // 40 + 40 topand bottom margins
    HeaderH = $(".custom-navbar").innerHeight(),
    FooterH = $(".btn-bar").innerHeight();

  //calc
  var calcHeight = window.innerHeight - (pageMargins + HeaderH + FooterH);
  return calcHeight;
}
$("#Techattr").on("shown.bs.collapse", function() {
  $(".files-panel").css("height", FilePanelH);
  
});
$(window).resize(function() {
  popUpH(), FilePanelH();
});
$("#ContentDetails").on("hide.bs.collapse", function() {
  $(".files-panel").css("height", FilePanelHNew);
  
});
$(window).resize(function() {
  popUpH(), FilePanelH();
});