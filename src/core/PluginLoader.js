'use strict';
const fs = require("fs");
const ini = require('../modules/ini.js');
const glob = require('glob');
const zlib = require('zlib');

module.exports = class PluginLoader {
  constructor(gameServer, version) {
    this.plugins = [];
    this.gameServer = gameServer;
    this.pluginGamemodes = [];
    this.extraC = [];
this.version = version; 

  }

  getPlugin() {
    return this.plugins

  }

  getPGamemodes() {
    return this.pluginGamemodes;
  }

  getPC() {
    return this.extraC;
  }

  load() {
    
    if (!fs.existsSync('./plugins')) {
    // Make log folder
    fs.mkdir('./plugins');
  }
    if (this.gameServer.config.dev == 1) {
      console.log("[Console] [\x1b[34mINFO\x1b[0m] Loading plugins in dev mode");
      var files = fs.readdirSync('./plugins/');
      for (var i in files) {
try {
            var plugin = require('../plugins/' + files[i] + '/index.js');
            } catch (e) {
              continue;
            }
        if (plugin.compatVersion) {
              var com = parseInt(plugin.compatVersion.replace(/\./g,''));
              var cur = parseInt(this.version.replace(/\./g,''));
              if (cur < com) {
                console.log("[Console] [\x1b[34mINFO\x1b[0m] pluginfile " + files[i] + " was not loaded as it is not compatible with v" + this.version + " Required: " + plugin.compatVersion)
                continue;
              }
            }
        if (plugin.name && plugin.author && plugin.version && plugin.init) {
          this.plugins[plugin.name] = plugin;
          if (this.plugins) {
            if (plugin.commandName) {
              for (var j in plugin.commandName) {
                if (plugin.commandName[j] && plugin.command[j]) {
                  this.extraC[plugin.commandName[j]] = plugin.command[j];
                }
              }
            }
              for (var j in plugin.gamemodeId) {
                if (plugin.gamemodeId[j] && plugin.gamemode[j]) {
                  this.pluginGamemodes[plugin.gamemodeId[j]] = plugin.gamemode[j];
                }
              }
              var config = [];
              if (plugin.config && plugin.configfile) {
                config = plugin.config
                try {
    // Load the contents of the config file
    var load = ini.parse(fs.readFileSync('./plugins/'  + files[i] + '/' + plugin.configfile, 'utf-8'));
    // Replace all the default config's values with the loaded config's values
    for (var obj in load) {
      this.plugins[plugin.name].config[obj] = load[obj];
      config[obj] = load[obj];
    }
  } catch (err) {
    // No config
    console.log("[Plugin] [\x1b[31mFAIL\x1b[0m]vPlugin configs for " + plugin.name + " Cannot be loaded");
  }
              }
              plugin.init(this.gameServer, config);
          }

          console.log("[Console] [\x1b[32mOK\x1b[0m] loaded plugin: " + plugin.name + " By " + plugin.author + " version " + plugin.version);

        } else {
          console.log("[Console] [\x1b[31mFAIL\x1b[0m]Didnt load pluginfile " + files[i] + " because it was missing parameters");
        }
      }

    } else {


      try {
        console.log("[Console] [\x1b[34mINFO\x1b[0m] Loading plugins");
        var files = fs.readdirSync('./plugins/');
        for (var i in files) {

          try {
            try {
            var plugin = require('../plugins/' + files[i] + '/index.js');
            } catch (e) {
              continue;
            }
            if (plugin.compatVersion) {
              var com = parseInt(plugin.compatVersion.replace(/\./g,''));
              var cur = parseInt(this.version.replace(/\./g,''));
              if (cur < com) {
                console.log("[Console] [\x1b[31mFAIL\x1b[0m] pluginfile " + files[i] + " was not loaded as it is not compatible with v" + this.version + " Required: " + plugin.compatVersion)
                continue;
              }
            }
            
            
            if (plugin.name && plugin.author && plugin.version && plugin.init) {
          this.plugins[plugin.name] = plugin;
          if (this.plugins) {
            if (plugin.commandName) {
              for (var j in plugin.commandName) {
                if (plugin.commandName[j] && plugin.command[j]) {
                  this.extraC[plugin.commandName[j]] = plugin.command[j];
                }
              }
            }
              for (var j in plugin.gamemodeId) {
                if (plugin.gamemodeId[j] && plugin.gamemode[j]) {
                  this.pluginGamemodes[plugin.gamemodeId[j]] = plugin.gamemode[j];
                }
              }
              var config = [];
              if (plugin.config && plugin.configfile) {
                config = plugin.config;
                try {
    // Load the contents of the config file
    var load = ini.parse(fs.readFileSync('./plugins/'  + files[i] + '/' + plugin.configfile, 'utf-8'));
    // Replace all the default config's values with the loaded config's values
    for (var obj in load) {
      this.plugins[plugin.name].config[obj] = load[obj];
      config[obj] = load[obj];
    }
  } catch (err) {
    // No config
    console.log("[Plugin] [\x1b[31mFAIL\x1b[0m] Plugin configs for " + plugin.name + " Cannot be loaded");
  }
              }
              plugin.init(this.gameServer, config);
          }

              console.log("[Console] [\x1b[32mOK\x1b[0m] loaded plugin: " + plugin.name + " By " + plugin.author + " version " + plugin.version);
            } else {
              console.log("[Console] [\x1b[31mFAIL\x1b[0m] Didnt load pluginfile " + files[i] + " because it was missing parameters");
            }
          } catch (e) {
            console.log("[Console] [\x1b[31mFAIL\x1b[0m] Failed to load pluginfile " + files[i] + " Reason: " + e);

          }
        }
      } catch (e) {
        console.log("[Console] [\x1b[31mFAIL\x1b[0m] Couldnt load plugins");
      }
    }


  }
}
