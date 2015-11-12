jQuery(function($){

    /* defining variables */

    var socket =io.connect();
    var $usernameForm = $('#setUsername');
    var $usernameError = $('#usernameError');
    var $username = $('#username');
    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');
    var $currentUser;

    /* notification */

    var Notification = {
        Vars:{
            OriginalTitle: document.title,
            Interval: null
        },
        On: function(notification, intervalSpeed){
            var _this = this;
            _this.Vars.Interval = setInterval(function(){
                document.title = (_this.Vars.OriginalTitle == document.title)
                    ? notification
                    : _this.Vars.OriginalTitle;
            }, (intervalSpeed) ? intervalSpeed : 1000);
        },
        Off: function(){
            console.log('test');
            clearInterval(this.Vars.Interval);
            document.title = this.Vars.OriginalTitle;
        }
    };

    /* setting username */

    $usernameForm.submit(function(e){
        e.preventDefault();
        if($username.val() == ""){
            $usernameError.html('Username can not be blank');
        } else{
            socket.emit('new user',$username.val(),function(data){
                if(data){
                    $('#usernameWrap').hide();
                    $('#chatWrapper').show();
                } else{
                    $usernameError.html('Username is already Taken!');
                }
            });
            $currentUser = $username.val();
            $username.val('');
        }
    });

    /* sending and receiving messages */

    $messageForm.submit(function(e){
        e.preventDefault();
        if($messageBox.val()==""){
            //blank message will not be sent
        } else{
            socket.emit('send message',$messageBox.val());
            $messageBox.val('');
        }
    });
    Notification_sub = Notification;
    socket.on('new message',function(data){
        if(data.username === $currentUser){
            data.colorClass = "sent";
        } else{
            data.colorClass = "received";
            Notification_sub.On("You have received a new message!");
        }
        $chat.append('<li class="' + data.colorClass + '"><b><span>' + data.username + '</span></b></br>' + data.message + "<br/></li>");
    });

    $(window).focus(function() {
        Notification_sub.Off();
    });

});