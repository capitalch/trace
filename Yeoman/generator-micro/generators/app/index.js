'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function camelToSnake(str) {
   return(str.split(/(?=[A-Z])/).join('-').toLowerCase())
}

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay('Trace React component generator')
    );

    const prompts = [
      {
        type: 'input',
        name: 'compNames',
        message: 'Comma separated list of new components ?',
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
  	const compArray = this.props['compNames'].split(',');
  	for(let compName of compArray){
		this.fs.copyTpl(this.templatePath('_comp.tsx'),this.destinationPath(`${camelToSnake(compName)}/` + `${camelToSnake(compName)}.tsx`),{compName:capitalizeFirstLetter(compName), snakeCompName: camelToSnake(compName) });		
  	}
  }

  install() {
    this.installDependencies({bower:false});
  }
};
