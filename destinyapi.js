const DestinyApi = require('destiny-api-client');
const MyApiKey = '39c516a91a234d1690f9d92079f9cbc4';

var user_dictionary = new Object();

module.exports = {
    proccess_text: function (message) {
        return _process_text(message);
    }
};

const ghost_commands = {
    kd: 'KD',
    kda: 'KDA',
    time: 'Time',
	pvptime: 'PvPTime',
	pvetime: 'PvETime',
	raids: 'Raids',
	strikes: 'Strikes',
    help: 'Help',
};

function _build_private_message_promise(text_response) {
	return new Promise(function (fulfill, reject){
		fulfill(_build_private_message(text_response));
	});		
}

function _build_private_message(text_response = 'Help: commands are: ' + Object.keys(ghost_commands).join(', ')) {
    var response = {
        response_type: 'ephemeral', // private message
        text: 'How to use /destinystats command:',
        attachments:[{
            text: text_response
        }]
    }
    return response;
}

function _build_public_message_promise(text_response) {
	return new Promise(function (fulfill, reject){
		fulfill(_build_public_message(text_response));
	});		
}

function _build_public_message(text_response) {
    var response = {
        response_type: 'in_channel', // public to the channle
        text: text_response,
    }
    return response;
};

function _process_text(message) {
	
	if((message.match(/ /g)||[]).length == message.length) {
		console.log('only spaces passed in');
		return _build_private_message_promise();
	}
	
	// This is never called
	if(message.length == 0) {
		console.log('no text passed');
		return _build_private_message_promise();
    }
	
    var splitText = message.toString().split(" "); 
    console.log(splitText);

    if(splitText.length == 0) {
		console.log('no space in text');
		return _build_private_message_promise();
    }
    
    var raw_command = splitText[0];
	var command = raw_command.toLowerCase();


    if(command.indexOf('help') > -1) {
		console.log('help passed');
		return _build_private_message_promise();
    }
    
    if(splitText.length == 1) {
		console.log('no username');
		return _build_private_message_promise('Username required.');
    } else if(splitText.length > 2) {
		console.log('no username');
		return _build_private_message_promise('Invalid username.');
    }
    
    var userName=splitText[1];    
	
	console.log(user_dictionary);
	
	if (typeof user_dictionary[userName] !== 'undefined' && user_dictionary[userName]) {
		console.log('old user ' + userName);
		return _process_command(user_dictionary[userName], command, userName);
	}
	else {
		console.log('new user ' + userName);
		let client = new DestinyApi(MyApiKey);    
		return client.searchPlayer({membershipType: DestinyApi.psn, displayName: userName})
			.then(response => _process_new_user_command(response, command, userName));
	}	
};

function _process_new_user_command(response, command, user_name) {
	// Get user ID
	user_id = _parse_response_for_id(response);
	if(user_id == -1) {
		return _build_base_message_promise('Username not found.');
	}
	console.log(user_id);
	// Add user to dictionary
	user_dictionary[user_name] = user_id;
	
	return _process_command(user_id, command, user_name);
}

function _process_command(user_id, command, userName) {
	
    let client = new DestinyApi(MyApiKey);

    // Switch statement
    // Right now everything uses the same base call
    // But in future code, we may have to make a different API call
    switch(command) {
        case 'kd':
		    return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
                .then(function(response) {
					let RatioString = response.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.displayValue;
					console.log(RatioString);
					return _build_public_message(userName + '\'s KD Ratio: ' + RatioString);
				});
			break;
        case 'kda':
			return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
                .then(function(response) {
				    let RatioString = response.mergedAllCharacters.results.allPvP.allTime.killsDeathsAssists.basic.displayValue;
					console.log(RatioString);
					return _build_public_message(userName + '\'s KDA Ratio: ' + RatioString);
				});
			break;
        case 'pvptime':
			return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
                .then(function(response) {
				    let time = response.mergedAllCharacters.results.allPvP.allTime.totalActivityDurationSeconds.basic.displayValue;
					console.log(time);
					return _build_public_message(userName + '\'s Time in PvP: ' + time);
				});
			break;
		case 'pvetime':
			return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
                .then(function(response) {
				    let time = response.mergedAllCharacters.results.allPvE.allTime.totalActivityDurationSeconds.basic.displayValue;
					console.log(time);
					return _build_public_message(userName + '\'s Time in PvE: ' + time);
				});
			break;
		case 'time':
			return client.accountStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id})
                .then(function(response) {
				    let time = response.mergedAllCharacters.merged.allTime.totalActivityDurationSeconds.basic.displayValue;
					console.log(time);
					return  _build_public_message(userName + '\'s Total Time On Destiny: ' + time);	
				});
			break;
		case 'raids':
			return client.characterStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id, characterId: 0})
                .then(function(response) {
				    let count = response.raid.allTime.activitiesCleared.basic.displayValue;
					console.log(count);
					return  _build_public_message(userName + '\'s Raids Completed: ' + count);	
				});
			break;
		case 'strikes':
			return client.characterStats({membershipType: DestinyApi.psn, destinyMembershipId: user_id, characterId: 0})
                .then(function(response) {
				    let count = response.allStrikes.allTime.activitiesCleared.basic.displayValue;
					console.log(count);
					return  _build_public_message(userName + '\'s Strikes Completed: ' + count);	
				});
			break;
        case 'summary':
        default:
			console.log('invalid command');
			return _build_private_message_promise('Invalid command. Valid commands are: '  + Object.keys(ghost_commands).join(', '));         
			break;
    }
}

function _parse_response_for_id(response) {
    if(response.length == 0) {
      return -1;
    } else {
      user_id = response[0].membershipId;
      return user_id;
    }
}
