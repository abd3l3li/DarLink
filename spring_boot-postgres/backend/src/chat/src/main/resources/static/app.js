const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/connect-to-stomp-service'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/temp', (req) => {
        showGreeting(req);
        console.log("this is the json msg => " + req.body);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#Messages").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.publish({
        destination: "/api/chat",
        body: JSON.stringify({'name': $("#name").val(), 'message':$("#msg").val()})
    });
}

function showGreeting(message) {
    console.log("inside the showGreeting this is the msg => " + message);
    $("#Messages").append("<tr><td>" + JSON.parse(message.body).name);
    $("#Messages").append("&nbsp;&nbsp;" + JSON.parse(message.body).message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendName());
});