# MMM-GoogleKeep

New module created with the help of CoPilot to show Google Keep notes on my Magic Mirror Dashboard.

## Installation

1. Clone the repository into your `MagicMirror/modules` folder:
   ```sh
   cd ~/MagicMirror/modules
   git clone https://github.com/KoboseHome/MMM-GoogleKeep.git
   cd MMM-GoogleKeep
   npm install

2. Add the module to your config/config.js file:
```
{
  module: "MMM-GoogleKeep",
  position: "top_left",
  config: {
    maximumEntries: 10,
    fetchInterval: 5 * 60 * 1000, // Update every 5 minutes
          }
}
```
## Setting up access to use your Google Keep notes

1. **Create a Google Cloud Project:**
   - First, you'll need to create a new project on Google Cloud Platform to manage your access to the Google Keep API.
   - Follow the detailed guide [here](https://developers.google.com/workspace/guides/create-project) to create your project. You can also use an existing project if you already have one.

2. **Enable Google Keep API:**
   - Once your project is ready, you need to enable the Google Keep API for it.
   - Visit [this link](https://developers.google.com/calendar/api/quickstart/nodejs#set_up_your_environment) and follow the instructions to enable the API in your project.

3. **Configure OAuth Consent Screen:**
   - For your application to access your Google Calendar, you'll need to configure the OAuth consent screen.
   - This step is crucial for authentication; detailed instructions can be found [here](https://developers.google.com/calendar/api/quickstart/nodejs#configure_the_oauth_consent_screen).
   - Don't forget to add yourself as a user once you've configured the consent screen.

After these initial setup steps, you're ready to create an OAuth 2.0 client ID:

4. **Create OAuth Client ID and Download Credentials:**
   - Within your Google Cloud project, proceed to create an OAuth client ID, explicitly choosing **"Desktop application"** as the application type. It's vital to select this specific type; choosing any other may lead to issues during authentication.
   - Once you've selected "Desktop application," go ahead and create the client ID.
   - Download the newly created client ID and save it as `credentials.json`.
   - This `credentials.json` file is crucial as it enables the connection between your MagicMirror and your Google Calendar.

5. **Move Your Credentials File:**
   - Take the `credentials.json` file and place it inside your MMM-GoogleKeep directory: `MagicMirror/modules/MMM-GoogleKeep/`.

6. **Authenticate with Google:**
   - Inside the MMM-GoogleKeep directory, run `node authorize.js` from your terminal.
   - This command will open a Google sign-in page in your web browser. Log in with your Google account as you normally would.
   - During this process, you might see a screen alerting you that "Google hasn't verified this app." This is a standard message for apps using OAuth that aren't published yet. Simply look for and click on the "Continue" button to proceed with the authentication.

By completing these steps, you've successfully laid the groundwork for your Google Calendar to communicate with your MagicMirror. The module is installed, and with the necessary permissions configured, you're ready to personalize your calendar settings.

Now that the install is finished, you can proceed to the next section to customize your calendar display settings. The following steps will guide you through configuring your calendar module in the MagicMirror configuration file.


## Authentication with Google
1. Go to the Google Cloud Console and create a new project.

2. Enable the Google Keep API for your project.

3. Create OAuth 2.0 credentials for your project:

  * Go to "APIs & Services" > "Credentials".
  * Click "Create Credentials" and select "OAuth 2.0 Client IDs".
  * Configure the consent screen and set the application type to "Desktop app".
  * Download the credentials.json file and place it in the MMM-GoogleKeep module folder.
  * Run the module to generate the authentication URL:
```
sh
cd ~/MagicMirror/modules/MMM-GoogleKeep
node authenticate.js
```
Open the URL provided in the terminal, grant access to your Google account, and paste the authorization code back into the terminal.

The module will save the access token in a token.json file.

Getting Google Keep Lists IDs
After authenticating, the module will automatically fetch and display your Google Keep notes.

To manually get the list IDs, you can use the Google Keep API Explorer:

Go to the Google Keep API Explorer.
Use the notes.list method to retrieve your notes and their IDs.
Add the note IDs to your config/config.js file if you want to display specific notes:

```
{
  module: "MMM-GoogleKeep",
  position: "top_left",
  config: {
    maximumEntries: 10,
    keepNotes: ["note_id_1", "note_id_2"]
  }
}
