// Generated by CoffeeScript 1.6.3
(function() {
  var changeToLoggedIn, getCards, getLists, grabBoards, showBoards, showCards, showLists, trelloAuth, trelloAuthFail, trelloAuthSuccess, trelloGetUsername;

  showCards = function(cards, list) {
    var outputList;
    outputList = $(list);
    $.each(cards, function(idx, card) {
      if (!card.closed) {
        return $("<li class='trello-card'>" + card.name + "</li><li class='divider'></li>").appendTo(outputList);
      }
    });
    return outputList.children('.divider').last().remove();
  };

  getCards = function(listID, list) {
    return Trello.get("lists/" + listID + "/cards", function(cards) {
      return showCards(cards, list);
    }, function() {
      return alert("Failed to get cards");
    });
  };

  showLists = function(lists) {
    var outputLists;
    outputLists = $("#listbuttons");
    return $.each(lists, function(idx, list) {
      var div, listElement;
      if (!list.closed) {
        div = $("<div class='btn-group'><button type='button'				 class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>" + list.name + "</button></div>").appendTo(outputLists);
        listElement = $("<ul id = 'list" + list.id + "' class='trello-listmenu dropdown-menu' role='menu'></ul>").appendTo(div);
        return getCards(list.id, listElement);
      }
    });
  };

  getLists = function(boardID) {
    return Trello.get("boards/" + boardID + "/lists", showLists, function() {
      return alert("Failed to get lists");
    });
  };

  showBoards = function(boards) {
    var boardoutput, getboards, listoutput;
    boardoutput = $("#boardbuttons");
    listoutput = $("#listbuttons");
    getboards = $("#getboards");
    getboards.empty().append("<br>");
    boardoutput.empty();
    listoutput.empty();
    return $.each(boards, function(idx, board) {
      if (!board.closed) {
        return $("<button type='button'				 class='btn btn-primary'>" + board.name + "</button>").appendTo(boardoutput).click(function(ev) {
          listoutput.empty();
          return getLists(board.id);
        });
      }
    });
  };

  grabBoards = function() {
    return Trello.get("members/my/boards", showBoards, function() {
      return alert("Failed to get boards");
    });
  };

  trelloGetUsername = function() {
    return Trello.get("members/me/username", changeToLoggedIn, function() {
      return alert("Failed to access username");
    });
  };

  changeToLoggedIn = function(username) {
    var login;
    login = $("#loggedin");
    login.empty();
    return login.append("<p class='btn btn-large btn-success disabled'>Logged in as " + username._value + "</p>");
  };

  trelloAuthSuccess = function() {
    var logbut, obj;
    logbut = $("#loginbutton");
    logbut.empty();
    trelloGetUsername();
    obj = $("#getboards");
    obj.append("<br><button class='btn btn-large btn-info'>Grab Trello Boards</button>");
    return obj.click(grabBoards);
  };

  trelloAuthFail = function() {
    return alert("Failed to authorize");
  };

  trelloAuth = function(ev) {
    var opts;
    opts = {
      type: "popup",
      name: "Randomization Tester",
      persist: true,
      expiration: "1hour",
      success: trelloAuthSuccess,
      fail: trelloAuthFail
    };
    return Trello.authorize(opts);
  };

  $(function() {
    return $("#loginbutton").click(trelloAuth);
  });

}).call(this);