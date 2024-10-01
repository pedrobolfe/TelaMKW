import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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

  placa: string = ''; // para buscar os dados
  numOS: string = '';

  codigoServico: string = ''; // armazenar esses dados para colocar no dialog
  descServico: string = '';

  intervalId: any;
  dias: number= 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  contando: boolean = false;

  // abrir o modal usando Bootstrap
  openModel(descServ: string, codServico: string, out_placa: string, numeroOS: string) {
    // atribui os valores recebidos aos atributos da classe
    this.placa = out_placa; 
    this.numOS = numeroOS; 
    this.descServico = descServ;  
    this.codigoServico = codServico;  
  
    //cria uma instancia do modal Bootstrap, passando o elemento do modal
    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    // exibir o modal
    modal.show();
  }

  startTempo() {// funcao para dar play no cronometro
    if (!this.contando){ // se contando for false, pode dar play, senão não
      this.contando = true; // variavel para ter controle, se o cronometro estiver pausado, ele vai dar play, senão não
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
      }, 1000);
    }
  }

  pauseTempo() { // função para pausar o cronometro
    clearInterval(this.intervalId);
    this.contando = false; // muda o contando para false
  }

  // Parar o temporizador e resetar
  stopTempo() { // funcao para parar e resetar o cronometro
    this.pauseTempo(); // Para o temporizador
    this.guardarTempo();

    this.segundos = 0; // Reseta os segundos
    this.minutos = 0; // ....
    this.horas = 0; 
    this.dias = 0;
  }

  guardarTempo(): void { // funcao para adicionar o tempo no json (em segundos), se ja tiver um tempo armazenado ele só vai somar.
    const tempoDuracao = this.dias * 86400 + this.horas * 3600 + this.minutos * 60 + this.segundos;
    
    // chamandoo método para atualizar o tempo no JSON
    this.service.updateTempo(this.placa, this.numOS, this.codigoServico, tempoDuracao).subscribe(response => {
        //alert('Tempo de duração atualizado: '+ response);
    });
  }
}
