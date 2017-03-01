const DestinyApi = require('destiny-api-client');
const MyApiKey = 'insert-key-here';

module.exports = {
    proccess_text: function (message) {
        return _process_text(message);
    }
};

const ghost_commands = {
    kd: 'kd',
    kda: 'summary',
    time: 'time',
    help: 'help',
};

// Help message that's printed when help is called
const help_message = {
    response_type: 'ephemeral', // private message
    text: 'How to use /destinystats command:',
    attachments:[{
        text: 'Valid commands are ' + Object.keys(ghost_commands).join(', ')
    }]
};

function _build_base_message(text_response) {
    var response = {
        response_type: 'ephemeral', // private message
        text: 'How to use /destinystats command:',
        attachments:[{
            text: text_response
        }]
    }
    return response;
};

function _process_text(message) {
    console.log(message);
    var splitText = message.toString().split(" "); 
    console.log(splitText);

    if(splitText.length == 0) {
        // Special help message with commands
        // Specify a command must be added
        return help_message;   
    }
    console.log('if no command passed');
    
    var command = splitText[0];

    if(command.indexOf('help') > -1) {
        // "Canned" report of valid commands
        return help_message;   
    }
    console.log('help message 1');
    
    // Verify command sent is a valid command
    
    if(splitText.length == 1) {
        // User name is required for commands
        return help_message;
    }
    console.log('help message 2');
    
    var userName=splitText[1];

    let client = new DestinyApi(MyApiKey);

    return client.searchPlayer({membershipType: DestinyApi.psn, displayName: userName})
        .then(response => _process_command(response, command));
};

function _process_command(response, command) {
    var user_id = _parse_response_for_id(response);
    let client = new DestinyApi(MyApiKey);

    // Switch statement
    // Right now everything uses the same base call
    // But in future code, we may have to make a different API call
    switch(command) {
        case 'kd':
        case 'kda':
        case 'time':
        case 'summary':
        default:
            return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
                .then(response => _format_response(response, command));
            break;
    }
}

function _format_response(response, command) {    
    let RatioString = response.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.value;
    let RatioFloat = parseFloat(RatioString);
    console.log(RatioFloat);
    return 'KD Ratio: ' + RatioFloat.toFixed(4);
}

function _parse_response_for_id(response) {
    if(response.length == 0) {
      return 'sad day';
    } else {
      user_id = response[0].membershipId;
      return user_id;
    }
};

function _get_command_and_name(userText) {
    return splitText = userText.toString().split(" ");  
    
    
}

function _get_command(message) {
  var command_keys = Object.keys(ghost_commands);
  var match;

  command_keys.every(function(element, index) {
    // Do something.
    if(message.indexOf(element) > -1) {
        match = element;
        console.log('match!');
        return false;
    }
    else {
      return true;
    }
  });
  return match;
};

function _get_parameter(message) {
  console.log(message);
  return 'Markov-Man';
};
