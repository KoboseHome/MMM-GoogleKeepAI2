/* Magic Mirror
 * Module: MMM-GoogleKeep
 */

Module.register("MMM-GoogleKeep", {
  // Define module defaults
  defaults: {
    maximumEntries: 10,
    fetchInterval: 5 * 60 * 1000, // Update every 5 minutes
    animationSpeed: 2000,
    fade: true,
    fadePoint: 0.25,
    keepNotes: []
  },

  // Define required scripts
  getScripts: function() {
    return ["moment.js"];
  },

  // Define required styles
  getStyles: function() {
    return ["MMM-GoogleKeep.css"];
  },

  // Define start sequence
  start: function() {
    Log.info("Starting module: " + this.name);
    this.sendSocketNotification("MODULE_READY");
  },

  // Override socket notification handler
  socketNotificationReceived: function(notification, payload) {
    if (notification === "KEEP_NOTES") {
      this.keepNotes = payload.notes;
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator
  getDom: function() {
    var wrapper = document.createElement("div");

    if (this.keepNotes.length === 0) {
      wrapper.innerHTML = "Loading notes...";
      return wrapper;
    }

    this.keepNotes.forEach(note => {
      var noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.innerHTML = note.title;
      wrapper.appendChild(noteElement);
    });

    return wrapper;
  }
});
