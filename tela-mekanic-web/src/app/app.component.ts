import { ServicoOrdemServicoComponent } from './servico-ordem-servico/servico-ordem-servico.component';
import { Component, ViewChild } from '@angular/core';
import { TempoServicoDialogComponent } from './tempo-servico-dialog/tempo-servico-dialog.component';
import { FormComponent } from './form/form.component';

import { HttpClient } from '@angular/common/http';
import { PecasOrdemServicoComponent } from './pecas-ordem-servico/pecas-ordem-servico.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TempoServicoDialogComponent,
    FormComponent,
    PecasOrdemServicoComponent,
    ServicoOrdemServicoComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private http: HttpClient
  ) {}

  formPreenchido: { placa: string; numOS: string;} | null = null;
  placa$ = new BehaviorSubject<string | undefined>(undefined);
  numOS$ = new BehaviorSubject<string | undefined>(undefined);
  
  onFormPreenchido(event: { placa: string; numOS: string;}) {
    if(event){
      this.formPreenchido = event;
      this.placa$.next(event.placa);
      this.numOS$.next(event.numOS);
    } else {
      this.formPreenchido = null;
    }
  }

}
