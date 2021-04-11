import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Macro } from '../models/macro.model';
import { MacroService } from '../services/macro.service';

@Injectable()
export class MacroResolve implements Resolve<Macro> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.macroService.getLatestMacro()
  }

  constructor(private macroService: MacroService) { }
}
