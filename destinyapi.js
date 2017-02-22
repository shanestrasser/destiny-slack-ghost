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

  switch (command) {
    case 'kd':
      const DestinyApi = require('destiny-api-client');
      let client = new DestinyApi('39c516a91a234d1690f9d92079f9cbc4');

      client.searchPlayer({membershipType: DestinyApi.psn, displayName: parameter})
      .then(response => var memberId = response.membershipId);

      //console.log(response);
      //var memberId = JSON.parse(response).membershipId;
      //console.log(memberId);

      //Statements executed when the result of expression matches value2
      return _build_base_message('not implemented');
      break  
    case 'kda':
      //Statements executed when the result of expression matches valueN
      return _build_base_message('not implemented');
      break
    case 'time':
      //Statements executed when the result of expression matches valueN
      return _build_base_message('not implemented');
      break
    case 'help':
    default:
      return help_message;   
      break;
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

  if(match.indexOf('help') > - 1) {
    return ghost_commands['help'];
  } else {
    return match;
  }
}

function _get_parameter(message) {
  console.log(message);
  return 'Markov-Man';
}
