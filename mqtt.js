const mqtt_topic="Vusur";

let room_info={};
let selected_room= 0;
let update_Display = null;

function parse_data(data){
    if (data.includes("*end*")){
        const middle_data = data.split("*start*")[1].split("*end*")[0];
        const sensor_data=JSON.parse(middle_data);
        data="";
        console.log(middle_data);
        console.log(sensor_data);
        room_info['prostor'+sensor_data.soba]=sensor_data;
        update_Display()
    }
}

function randomClientId(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return "clientId-" + text;
}

var websocketclient = {
    'client': null,
    'lastMessageId': 1,
    'lastSubId': 1,
    'subscriptions': [],
    'messages': [],
    'connected': false,

    'connect': function (host="mqtt-dashboard.com", port=8884, clientId=null, username="", password="", keepAlive=60) {
        if (clientId === null)
            clientId = randomClientId(10);
        var cleanSession = true;
        var lwTopic = "";
        var lwQos = 0;
        var lwRetain = false;
        var lwMessage = "";
        var ssl = true;

        this.client = new Messaging.Client(host, port, clientId);
        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;

        var options = {
            timeout: 3,
            keepAliveInterval: keepAlive,
            cleanSession: cleanSession,
            useSSL: ssl,
            onSuccess: this.onConnect,
            onFailure: this.onFail
        };

        if (username.length > 0) {
            options.userName = username;
        }
        if (password.length > 0) {
            options.password = password;
        }
        if (lwTopic.length > 0) {
            var willmsg = new Messaging.Message(lwMessage);
            willmsg.qos = lwQos;
            willmsg.destinationName = lwTopic;
            willmsg.retained = lwRetain;
            options.willMessage = willmsg;
        }

        this.client.connect(options);
    },

    'onConnect': function () {
        websocketclient.connected = true;
        console.log("connected");
        if (websocketclient.subscribe(mqtt_topic, 1, "")) {
            alert("Connected to MQTT server!");
        }
    },

    'onFail': function (message) {
        websocketclient.connected = false;
        console.log("error: " + message.errorMessage);
    },

    'onConnectionLost': function (responseObject) {
        websocketclient.connected = false;
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
        // $('body.connected').removeClass('connected').addClass('notconnected').addClass('connectionbroke');

        //Cleanup messages
        websocketclient.messages = [];

        //Cleanup subscriptions
        websocketclient.subscriptions = [];
    },

    'onMessageArrived': function (message) {
       console.log("onMessageArrived:", message);

        var subscription = websocketclient.getSubscriptionForTopic(message.destinationName);

        parse_data(message.payloadString);
    },

    'disconnect': function () {
        this.client.disconnect();
    },

    'publish': function (topic, payload, qos, retain) {

        if (!websocketclient.connected) {
            return false;
        }

        var message = new Messaging.Message(payload);
        message.destinationName = topic;
        message.qos = qos;
        message.retained = retain;
        this.client.send(message);
    },

    'subscribe': function (topic, qosNr, color) {

        if (!websocketclient.connected) {
            return false;
        }

        if (topic.length < 1) {
            return false;
        }

        // if (_.find(this.subscriptions, { 'topic': topic })) {
        //     return false;
        // }

        this.client.subscribe(topic, {qos: qosNr});
        if (color.length < 1) {
            color = '999999';
        }

        var subscription = {'topic': topic, 'qos': qosNr, 'color': color};
        this.subscriptions.push(subscription);
        return true;
    },

    'unsubscribe': function (id) {
        var subs = _.find(websocketclient.subscriptions, {'id': id});
        this.client.unsubscribe(subs.topic);
        websocketclient.subscriptions = _.filter(websocketclient.subscriptions, function (item) {
            return item.id != id;
        });

    },

    'deleteSubscription': function (id) {
        var elem = $("#sub" + id);

        if (confirm('Are you sure ?')) {
            elem.remove();
            this.unsubscribe(id);
        }
    },

    'getSubscriptionForTopic': function (topic) {
        var i;
        for (i = 0; i < this.subscriptions.length; i++) {
            if (this.compareTopics(topic, this.subscriptions[i].topic)) {
                return this.subscriptions[i];
            }
        }
        return false;
    },

    'getColorForPublishTopic': function (topic) {
        var id = this.getSubscriptionForTopic(topic);
        return this.getColorForSubscription(id);
    },


    'compareTopics': function (topic, subTopic) {
        var pattern = subTopic.replace("+", "(.*?)").replace("#", "(.*)");
        var regex = new RegExp("^" + pattern + "$");
        return regex.test(topic);
    },

};

document.addEventListener('DOMContentLoaded', async function(){ 
    const radioButtons = document.querySelectorAll('input[name="prostor"]');
    const dataDisplay = document.getElementById('prikaz_desni');
    
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', function() {
            if (this.checked) {
                selected_room=this.value;
                updateDisplay();
            }
        });
    });
    
    
    function updateDisplay(){
        if(selected_room in room_info){
        var temp = Math.round(room_info[selected_room].temp*10) / 10; 
        dataDisplay.textContent = `Temperatura je ${temp}°C`
        } else{
            dataDisplay.textContent = 'Nema dostupnih podataka za prikaz.';
        }
    };
    update_Display=updateDisplay;
    websocketclient.connect();
    })