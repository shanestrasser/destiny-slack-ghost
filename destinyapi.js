const DestinyApi = require('destiny-api-client');
const MyApiKey = 'insert-key-here';

module.exports = {
  proccess_text: function (message) {
    return _process_text(message);
  },
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
  attachments:[
  {
    text: 'Valid commands are ' + Object.keys(ghost_commands).join(', ')
  }
  ]
};

function _build_base_message(text_response) {
  var response = {
  response_type: 'ephemeral', // private message
  text: 'How to use /destinystats command:',
  attachments:[
  {
    text: text_response
  }
  ]}
  return response;
};

function _process_text(message) {
    var command = _get_command(message);
    var parameter = _get_parameter(message);

    if(command.indexOf('help') > -1) {
      return help_message;   
    }

    let client = new DestinyApi(MyApiKey);

    return client.searchPlayer({membershipType: DestinyApi.psn, displayName: 'Markov-Man'})
    .then(response => _process_command(response, command));
};

function _process_command(response, command) {
    var user_id = _parse_response_for_id(response);

    let client = new DestinyApi(MyApiKey);

    return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
    .then(response => _format_response(response, command));
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
