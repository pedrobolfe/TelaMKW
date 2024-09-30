import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { delay } from 'rxjs';
import { FormServiceService } from '../form-service/form-service.service';

declare var bootstrap: any;

@Component({
  selector: 'app-tempo-servico-dialog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tempo-servico-dialog.component.html',
  styleUrls: ['./tempo-servico-dialog.component.css']
})
export class TempoServicoDialogComponent {
  @ViewChild('tempoServicoModal') modalElement!: ElementRef;

  constructor (
    private service: FormServiceService
  ) {}

  placa: string = '';
  numOS: string = '';
  codigoServico: string = '';
  descServico: string = '';

  intervalId: any;
  dias: number= 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  contando: boolean = false;

  // Abrir o modal usando Bootstrap
  openModel(descServ: string, codServico: string, out_placa: string, numeroOS: string) {
    this.placa = out_placa;
    this.numOS = numeroOS;
    this.descServico = descServ;
    this.codigoServico = codServico;

    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }

  // Iniciar o temporizador
  startTempo() {
    if (!this.contando){
      this.contando = true;
      this.intervalId = setInterval(() => {
        this.segundos++;
        if (this.segundos === 60) {
            this.segundos = 0;
            this.minutos++;
        }
        if (this.minutos === 60) {
            this.minutos = 0;
            this.horas++;
        }
        if (this.horas === 24){
          this.horas = 0;
          this.dias++;
        }
      }, 1);
    }
  }

  pauseTempo() {
    clearInterval(this.intervalId);
    this.contando = false;
  }

  // Parar o temporizador e resetar
  stopTempo() {
    this.pauseTempo(); // Para o temporizador
    this.guardarTempo();

    this.segundos = 0; // Reseta os segundos
    this.minutos = 0; 
    this.horas = 0; 
    this.dias = 0;
  }

  setDados(placa: string, numOS: string): void {
    //alert(" ==== "+placa + ": " + numOS + ": " + codServico)
    this.placa = placa;
    this.numOS = numOS;
  }

  guardarTempo(): void {
    const tempoDuracao = this.dias * 86400 + this.horas * 3600 + this.minutos * 60 + this.segundos;
    
    alert(`minutos ${this.minutos}`);
    
    // Aqui você chamaria o método para atualizar o tempo no JSON
    this.service.updateTempo(this.placa, this.numOS, this.codigoServico, tempoDuracao).subscribe(response => {
        alert('Tempo de duração atualizado: '+ response);
    });
  }
}
