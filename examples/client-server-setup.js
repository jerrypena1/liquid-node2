// global objects are the keys to how we communicate with the liquid2 module
// there's one for the client-side processing and another we'll use for server-side 
// processing, but there's nothing stopping you from using them for anything.
global.LiquidEngineOptions = {} // server config
global.LiquidEngineOptions2 = {} // client config

// now we'll override the first engine which we'll use for server-side processing
LiquidEngineOptions.TagStart = /\<%/
LiquidEngineOptions.TagEnd = /%\>/
LiquidEngineOptions.VariableStart = /\<%=/
LiquidEngineOptions.VariableEnd = /%\>/
LiquidEngineOptions.VariableIncompleteEnd = /%\/?/
LiquidEngineOptions.AnyStartingTag = RegExp(LiquidEngineOptions.TagStart.source + "|" + LiquidEngineOptions.VariableStart.source)
LiquidEngineOptions.PartialTemplateParser = RegExp(LiquidEngineOptions.TagStart.source + '.*?' + LiquidEngineOptions.TagEnd.source + '|' + LiquidEngineOptions.VariableStart.source + '.*?' + LiquidEngineOptions.VariableIncompleteEnd.source)
LiquidEngineOptions.TemplateParser = RegExp('(' + LiquidEngineOptions.PartialTemplateParser.source + '|' + LiquidEngineOptions.AnyStartingTag.source + ')')

// now we'll load the module, it's important that this happens AFTER you've setup the globals above
// const Liquid = require('liquid2')
const Liquid = require('../lib/index')

// now we'll instantiate the two engines
const engineS = new Liquid.Engine()
const engineC = new Liquid.L2.Engine()

// registering a few example filters on the client-side engine
engineC.registerFilters({
  cut: function (input, string) {
    let regex = new RegExp(string.toString().replace(/([^a-z0-9])/ig, '\\$1'), 'g');
    let newInput = input.toString().replace(regex, "");
    return newInput;
  },
  floatformat: function (input, string) {
    const newInput = new Number(input);
    const newString = new Number(string);
    if (newString == 'NaN') {
      newString = 2;
    }
    if (newInput == 'NaN') {
      console.log('this isnt a number and it should be', newInput);
      return input;
    }
    return parseFloat(newInput).toFixed(newString);
  },
  format_date_string: (input) => {
    var date = new Date(input);
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
  },
  upper: (input) => {
    return input.toString().toUpperCase()
  },
  date: (input, format) =>{
    return input;
  }  
});

// here we're creating a new tag
class UnsubscribeLink extends Liquid.Tag {
  render () {
    return '#';
  }
}
// and here we register the new tag to the client-side engine
engineC.registerTag('unsubscribe_link', UnsubscribeLink);

// And finally, here is how you could use this. 

const templateSrc = "<%= name %>'s the most AMAZING {{ occupation }}!!!"
const serverData = { name: 'Tobi' }
const clientData = { occupation: 'plumber' }
engineS
  .parseAndRender( templateSrc, serverData )
  .then( result => engineC.parseAndRender(result, { ...serverData, ...clientData }) )
  .then( result => console.log(result) )


// You could also put this code into its own file in your project, uncomment the 
// line below and require it in your project to turn all this setup goodness into its
// own module and return your new shinny engines

// module.exports = { engineS, engineC };


