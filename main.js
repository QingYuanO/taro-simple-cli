#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const fs = require('fs');
// const ora = require('ora');
const chalk = require('chalk');
// const symbols = require("log-symbols");

program
  .version('0.0.1', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (fs.existsSync(name)) {
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(chalk.red('项目已存在'));
      return;
    }
    inquirer
      .prompt([
        {
          name: 'description',
          message: '请输入项目描述',
        },
        {
          name: 'author',
          message: '请输入作者名称',
        },
      ])
      .then((answers) => {
        download(
          'direct:https://github.com/QingYuanO/taro-simple-template#master',
          name,
          { clone: true },
          (err) => {
            // const spinner = ora('正在下载模板...');
            // spinner.start();
            if (!err) {
              // spinner.succeed();
              const meta = {
                name,
                description: answers.description,
                author: answers.author,
              };
              const fileName = `${name}/package.json`;
              if (fs.existsSync(fileName)) {
                const content = fs.readFileSync(fileName).toString();
                const result = handlebars.compile(content)(meta);
                fs.writeFileSync(fileName, result);
              }
              console.log(chalk.green('项目初始化完成'));
            } else {
              // spinner.fail();
              console.log(chalk.red(`拉取远程仓库失败${err}`));
            }
          }
        );
      });
  });
//解析命令行
program.parse(process.argv);
