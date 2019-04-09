class gmailAPI {
    constructor(apiKey, clientId) {
        this.CLIENT_ID = clientId;
        this.API_KEY = apiKey;
       
        // Array of API discovery doc URLs for APIs used by the quickstart
        this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
       
        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        this.SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
        this.gapi =  window.gapi

        

    }
    initClient = () => {

        console.log(window.gapi)
        window.gapi.client.init({
          apiKey: this.API_KEY,
          clientId: this.CLIENT_ID,
          discoveryDocs: this.DISCOVERY_DOCS,
          scope: this.SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listLabels();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }


      /**
       *  Sign in the user upon button click.
       */
      handleAuthClick = (event) => {
        this.gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      handleSignoutClick = (event) => {
        this.gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      appendPre = (message) => {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print all Labels in the authorized user's inbox. If no labels
       * are found an appropriate message is printed.
       */
      listLabels = () => {
        this.gapi.client.gmail.users.labels.list({
          'userId': 'me'
        }).then(function(response) {
          var labels = response.result.labels;
          this.appendPre('Labels:');

          if (labels && labels.length > 0) {
            for (let i = 0; i < labels.length; i++) {
              var label = labels[i];
              this.appendPre(label.name)
            }
          } else {
            this.appendPre('No Labels found.');
          }
        });
      }
}

export default gmailAPI;

    