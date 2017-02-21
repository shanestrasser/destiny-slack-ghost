module.exports = {
  // List of valid commands
  ghost_commands: {
    kd: 'kd',
    kda: 'summary',
    time: 'time',
    help: 'help',
  },
  // Help message that's printed when help is called
  help_message: {
    response_type: 'ephemeral', // private message
    text: 'How to use /destinystats command:',
    attachments:[
    {
      text: 'Valid commands are',
    }
    ]
  }
};