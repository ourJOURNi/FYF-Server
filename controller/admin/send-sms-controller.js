// File: Send verification code text message to user phone number using Twilio API

const todoolieSMS = '+13137446252'                //ToDoolie's phone number

const accountSid = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;
const todooliePhone = process.env.TWILIO_NUMBER;

const client = require('twilio')(accountSid, authToken);

module.exports = {
  setCredentials: function (password, phoneNumber, callback) {
    this.password = password;
    client.messages.create({
      body: 'Welcome! Use the code ' + this.password + ' to log in to the ToDoolie mobile app',// body of text message is sent along with OTP.
      from: todooliePhone, //twilio phone number testing credentials
      to: '+1' + phoneNumber //user phone number
    }, function (error, message) { //error handling for invalid phone numbers
      if (!error) {
        console.log('Success! The ISD for this SMS message is: ' + message.sid);
        console.log('Message sent on: ' + message.dateCreated);
        callback(true);
      } else {
        console.log('Failed to send message :(');
        console.log(error)
        callback(false);
      }
    })
    //then(message => console.log(message.sid)).done();
  },

  //text message for reminder notifications
  reminderText: async function (result, notifyType, callback) {
    try {
      var i;
      for (i in result) {
        phoneNumber = result[i].helperPhone;
        title = result[i].jobSubType + ' for ' + result[i].clientName;
        jobDateTime = result[i].jobDate.toString().substring(0, 15) + ' @ ' +
          result[i].jobTimeStart.substring(0, 5) + result[i].jobTimeStart.substring(8, 11);
        textMsg = 'ToDoolie reminder: ' + title + ' starts in ' + notifyType + '.\n' + jobDateTime;

        await client.messages.create({
          body: textMsg,
          from: todooliePhone, //twilio phone number testing credentials
          to: '+1' + phoneNumber //user phone number
        }, function (error, message) { //error handling for invalid phone numbers
          if (!error) {
            console.log('\nISD: ' + message.sid + ' ' + message.dateCreated + '\n' +
              phoneNumber + ': ' + title + ' in ' + notifyType);
          } else {
            console.log('\nFailed to send: ' + phoneNumber + ', ' + title + ' in ' + notifyType);
          }
        });
      }
      return callback();
    } catch {
      console.log('Caught error in reminderText()');
    }
  },

  //text message for friend referral
  textFriend: async function (helperName, referenceCode, friendName, friendPhone, callback) {
    try {
      textMsg = 'Hi ' + friendName + ', your friend ' + helperName + ' referred you to ToDoolie! ' +
        'Download the app from the Android or iOS app store and use the code ' + referenceCode +
        ' when signing up. You and ' + helperName + ' will both earn a bonus $20 when you complete your first job.';
      console.log(textMsg);

      await client.messages.create({
        body: textMsg,
        from: todooliePhone, //twilio phone number testing credentials
        to: '+1' + friendPhone //user phone number
      }, function (error, message) { //error handling for invalid phone numbers
        if (!error) {
          console.log('Text message referral success, ' + helperName + ' to ' + friendName);
          return callback(true);

        } else
          console.log('\nFailed to refer: ' + helperName + ' to ' + friendName);
        return callback(false);
      });
    } catch {
      console.log('Caught error in textFriend()');
    }
  },

  //text message for clock in notification
  notifyClock: function (jobSubType, clientName, clientPhone, helperName, now, location)//notifies client and ToDoolie of user clock in
  {
    textMsg = helperName + ' just clocked in at ' + now + ' for ' + jobSubType + ' for ' + clientName + ' clock in location: ' + location + '.';
    //console.log(location);
    console.log(textMsg);
    var recepients = ['1' + clientPhone, todoolieSMS];
    client.messages.create({
      body: textMsg,
      from: todooliePhone,
      to: recepients
      //to:'+15868793327'
    }, function (error, message) {
      if (!error) {
        console.log('Success! The ISD for this SMS message is: ' + message.sid);
        console.log('Message sent on: ' + message.dateCreated);

      } else {
        console.log("Failed to send clock in message");
      }
    });
  },
  notifyClockOut: function (jobSubType, clientName, clientPhone, helperName, now, location, pAmount) {
    textMsg = helperName + ' just clocked out at ' + now + ' for ' + jobSubType + ' for ' + clientName + ' clock in location: ' + location + '.'
      + ' The total payout for this session is: $' + pAmount / 100;
    console.log(textMsg);
    var recepients = ['1' + clientPhone, todoolieSMS];
    client.messages.create({
      body: textMsg,
      from: todooliePhone,

      to: recepients
      //to:'+15868793327'
    }, function (error, message) {
      if (!error) {
        console.log('Success! The ISD for this SMS message is: ' + message.sid);
        console.log('Message sent on: ' + message.dateCreated);
      }
      else {
        console.log("failed to send clock out message");
      }
    });

  }
}