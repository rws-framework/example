

import 'reflect-metadata';

import chalk from 'chalk';

import { Injectable } from '@nestjs/common';
import { DBService, ProcessService } from '@rws-framework/server';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/AuthService';
import { ConsoleService, UtilsService } from '@rws-framework/server';
import { RWSBaseCommand, RWSCommand } from '@rws-framework/server/src/commands/_command';
import { ParsedOptions } from '@rws-framework/server/exec/src/application/cli.module';

import User from '../models/User';

@Injectable()
@RWSCommand({name: 'admin-add', description: 'Systems init command.'})
export class AdminStartCommand extends RWSBaseCommand {
  constructor(
    protected readonly authService: AuthService,
  ) {    
    super();    
  }    

  async run(
    passedParams: string[],
    options: ParsedOptions
  ): Promise<void> {
    const [login, pass] = passedParams;
    this.consoleService.log(this.consoleService.color().green(`[RWS] adding admin (${login}/${pass})... `));    

    const exUser: User = await User.findOneBy({ conditions: { username: login } });
    
    if(exUser){
      console.log(chalk.yellow(`User ${login} already exists`));
      return;
    }

    const hashedPassword = await this.authService.hashPassword(pass);
    const user = new User({
      username: login,
      passwd: hashedPassword,
      created_at: new Date(),
      active: true
    });

    console.log({user})

    await user.save();

    console.log('Admin added.')
  }
}
