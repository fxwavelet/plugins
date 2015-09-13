# Plugin: fx-config

## Description
Provide configuration service to share config between plugins

## Consumes
none

## Provides

- config

## Interface

`````javascript
var config = imports.config;
`````

#### config.create(defaultConfig)
Create configuration from an object, return a config object

#### config.shared()
Get all shared configurations, return a config object

### **config object [configObj]**

##### configObj.all()
return all config key value pairs

##### configObj.get([String] name)
get config *name*

##### configObj.set([String] name, [Object] value)
set config *name* to *value*