import fs = require('file-system');
import { Helper } from './helper';

const helperService = new Helper;
const configFile = 'config.json';

export class Config {

  static instance: Config;
  private config;

  public read(cb: Function): void {
    if (Config.instance) {
      cb();
      return;
    }

    let documents = fs.knownFolders.currentApp();
    let jsonFile = documents.getFile(configFile);
    jsonFile.readText()
      .then((content) => {
        Config.instance = new Config();
        Config.instance.config = JSON.parse(content);
        cb();
        return;
      }, () => {
        console.log('Could not read config file.');
      });
  }

  public getConfig(configNode = [], dynamic?: any): any {
    try {
      if (!configNode.length) {
        throw 'Empty nodes';
      }

      if (!Config.instance.config) {
        throw 'Config file not loaded';
      }

      let configState = Config.instance.config;
      for (let c in configNode) {
        if (typeof configState[c] == undefined) {
            return null;
        }
        configState = configState[configNode[c]];
      }

      if (dynamic) {
        for (let d in dynamic) {
          configState = helperService.replaceAll(configState, `$[${d}]`, dynamic[d]);
        }
      }

      return configState;
    } catch (err) {
      console.log(`Config Error: ${err}`);
      return null;
    }
  }
}
