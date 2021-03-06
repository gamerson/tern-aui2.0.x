var yuidoc2tern = require("../generator/yuidoc2tern"), assert = require('assert');

var assertExtractType = function (yuiType, expected) {
  var type = yuidoc2tern.extractYUIType(yuiType);
  assert.equal(type, expected);
}

exports['test extract type'] = function() {
  assertExtractType(null, null);
  assertExtractType('Anim', 'Anim');
  assertExtractType('Any|Object', 'Any');
  assertExtractType('Any | Object', 'Any');
  assertExtractType('{Any}', 'Any');
  assertExtractType('{ Number }', 'Number');
  assertExtractType('{ArrayList|Widget}', 'ArrayList'); 
  assertExtractType('{string: boolean}', 'string');
  assertExtractType('{Object} the values are HTML strings', 'Object');
  assertExtractType('{null}', null);
  assertExtractType('Object*', 'Object');
  assertExtractType('Number | false', 'Number');
  assertExtractType('Number/false', 'Number');
  assertExtractType('Number[]', 'Number[]');
  assertExtractType('Number[]|Node', 'Number[]');
  assertExtractType('string| {searchExp: string, replaceStr: string}', 'string');
  assertExtractType('{searchExp: string, replaceStr: string} | string', 'searchExp');
}

var assertGetPropertyTernType = function (yuiType, expected) {
  var type = yuidoc2tern.getPropertyTernType(yuiType);
  assert.equal(type, expected);
}

exports['test getPropertyTernType'] = function() {	
  assertGetPropertyTernType('Number', 'number');
  assertGetPropertyTernType('Any', '?');
}

exports['test getTernType - YUIClass'] = function() {
  var yuiDoc = {
    classes: {
      Anim: {
        module: "anim" 
      }	
    }		  
  }
  var yuiClass = {
    module: 'anim',
    name: 'Anim',
    is_constructor: 1
  };
  var type = yuidoc2tern.getTernType(yuiClass, yuiDoc);
  assert.equal(type, 'fn() -> +anim.Anim');
}

exports['test getTernType - YUIClassItem - method'] = function() {  	
  var yuiDoc = {
    classes: {
      Anim: {
        module: "anim" 
      }	
    }		  
  }
  var yuiClassItem = {
    module: 'anim',
    "class": 'Anim',
    name: "getBezier",
    "static": 1,
    params: [{name:"points", type: "Number[]" },
             {name:"t", type: "Number" }],
    "return": {
      type: "Number[]"	
    }
  };
  var type = yuidoc2tern.getTernType(yuiClassItem, yuiDoc);
  assert.equal(type, 'fn(points: [number], t: number) -> [number]');
}

exports['test getTernType - YUIClassItem - method with callback'] = function() {  	
  var yuiDoc = {
    classes: {
      View: {
        module: "app" 
      },
      Object: {
        module: "yui"
      }
    }		  
  }
  var yuiClassItem = {
    module: 'app',
    "class": 'App.Content',
    name: "showContent",
    itemtype: "method",
    chainable: 1,
    params: [{name:"content", type: "HTMLElement|Node|String" },
             {name:"options", type: "Object", optional: true,
              props: [{name: "view", type: "Object|String"},
                      {name: "config", type: "Object", optional: true}
                     ]
              },
              {name:"callback", type: "Function", optional: true,
               props: [{name: "view", type: "View"}               
                      ]
              }
            ],
    "return": {
      type: "Number[]"	
    }
  };
  var type = yuidoc2tern.getTernType(yuiClassItem, yuiDoc);
  assert.equal(type, 'fn(content: +HTMLElement, options?: +yui.Object, callback?: fn(view: +app.View)) -> !this');
}

if (module == require.main) require("test").run(exports);