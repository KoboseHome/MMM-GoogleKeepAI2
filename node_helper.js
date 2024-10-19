const NodeHelper = require("node_helper");
const { google } = require("googleapis");
const fs = require("fs");
const Log = require("logger");

const TOKEN_PATH = "/token.json";

module.exports = NodeHelper.create({
  start: function() {
    Log.log("Starting node helper for: " + this.name);
    this.keepService;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "MODULE_READY") {
      if (!this.keepService) {
        this.authenticate();
      } else {
        this.sendSocketNotification("SERVICE_READY", {});
      }
    }
  },

  authenticate: function() {
    var _this = this;

    fs.readFile(_this.path + "/credentials.json", (err, content) => {
      if (err) {
        _this.sendSocketNotification("AUTH_FAILED", { error_type: err });
        return console.log("Error loading client secret file:", err);
      }

      authorize(JSON.parse(content), _this.startKeepService);
    });

    function authorize(credentials, callback) {
      const { client_secret, client_id, redirect_uris } = credentials.web;
      _this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      fs.readFile(_this.path + TOKEN_PATH, (err, token) => {
        if (err) {
          const redirect_uri = redirect_uris[0];
          _this.sendSocketNotification("AUTH_NEEDED", {
            url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/keep.readonly&access_type=offline&include_granted_scopes=true&response_type=code&state=${_this.name}&redirect_uri=${redirect_uri}&client_id=${client_id}`
          });
          return console.log("Error loading token:", err);
        }
        _this.oAuth2Client.setCredentials(JSON.parse(token));
        callback(_this.oAuth2Client, _this);
      });
    }
  },

  startKeepService: function(auth, _this) {
    _this.keepService = google.keep({ version: "v1", auth });
    _this.sendSocketNotification("SERVICE_READY", {});
    _this.fetchKeepNotes();
  },

  fetchKeepNotes: function() {
    var _this = this;
    _this.keepService.notes.list({}, (err, res) => {
      if (err) {
        Log.error("MMM-GoogleKeep Error: ", err);
        _this.sendSocketNotification("KEEP_ERROR", { error_type: err });
        return;
      }
      _this.sendSocketNotification("KEEP_NOTES", { notes: res.data.items });
    });
  }
});
