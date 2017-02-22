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

  if(command.indexOf('help') > - 1) {
    return help_message;
  } else {
    return _build_base_message(command);
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
