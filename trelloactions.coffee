

showCards = (cards,list) ->
	# outputCards = $ "#list#{listID}"
	# console.log(outputCards)
	outputList = $ list
	$.each cards,
		(idx, card) ->
			if !card.closed
				$("<li class='trello-card'>#{card.name}</li><li class='divider'></li>").
					appendTo outputList
	outputList.children('.divider').last().remove()

getCards = (listID, list) ->
	Trello.get "lists/#{listID}/cards",
		(cards) -> showCards(cards,list),
		() ->
			alert "Failed to get cards"

showLists = (lists) ->

	outputLists = $ "#listbuttons"
	$.each lists,
		(idx, list) ->
			if !list.closed
				div = $("<div class='btn-group'><button type='button'
				 class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>#{list.name}</button></div>").
				appendTo(outputLists)
				listElement = $("<ul id = 'list#{list.id}' class='trello-listmenu dropdown-menu' role='menu'></ul>").appendTo div
				getCards list.id, listElement

getLists = (boardID) ->
	Trello.get "boards/#{boardID}/lists",
		showLists,
		() ->
			alert "Failed to get lists"

showBoards = (boards) ->
	boardoutput = $ "#boardbuttons"
	listoutput = $ "#listbuttons"
	getboards = $ "#getboards"
	getboards.empty().append("<br>")
	boardoutput.empty()
	listoutput.empty()
	$.each boards,
		(idx, board) ->
			if !board.closed
				$("<button type='button'
				 class='btn btn-primary'>#{board.name}</button>").
					appendTo(boardoutput).
					click (ev) ->
						listoutput.empty()
						getLists board.id


grabBoards = () ->
	Trello.get "members/my/boards",
		showBoards,
		() ->
			alert "Failed to get boards"

trelloGetUsername = () ->
	Trello.get "members/me/username", 
		changeToLoggedIn,
		() -> 
			alert "Failed to access username"

changeToLoggedIn = (username) ->
	login = $ "#loggedin"
	login.empty()
	login.append("<p class='btn btn-large btn-success disabled'>Logged in as #{username._value}</p>")

trelloAuthSuccess = () ->
	logbut = $ "#loginbutton"
	logbut.empty()
	trelloGetUsername()
	obj = $ "#getboards"
	obj.append("<br><button class='btn btn-large btn-info'>Grab Trello Boards</button>") 
	obj.click grabBoards

trelloAuthFail = () ->
	alert "Failed to authorize"

trelloAuth = (ev) ->
	opts = {
		type: "popup"
		name: "Randomization Tester"
		persist: false
		expiration: "1hour"
		success: trelloAuthSuccess
		fail: trelloAuthFail
	}

	Trello.authorize opts

$ () ->
	$("#loginbutton").click trelloAuth