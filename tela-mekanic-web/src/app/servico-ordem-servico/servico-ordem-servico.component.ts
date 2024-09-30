import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormServiceService } from '../form-service/form-service.service';
import { delay, Observable, of } from 'rxjs';
import { TempoServicoDialogComponent } from '../tempo-servico-dialog/tempo-servico-dialog.component';

@Component({
  selector: 'app-servico-ordem-servico',
  standalone: true,
  imports: [
    CommonModule,
    TempoServicoDialogComponent
  ],
  templateUrl: './servico-ordem-servico.component.html',
  styleUrl: './servico-ordem-servico.component.css'
})
export class ServicoOrdemServicoComponent {
  @ViewChild(TempoServicoDialogComponent) tempoServicoComponent!: TempoServicoDialogComponent;
  outDescServico: string = "";

  constructor(
    private service: FormServiceService
  ){}
  
  dados$: Observable<any> = of([]);
  
  @Input() placa!: string;
  @Input() numOS!: string;
  codServico: string[] = [];
  descServico: string[] = [];
  tempoServico: number[] = [];

  ngOnInit() {
    delay(2000);
    this.dados$ = this.service.getDados();
    
    this.consulta(this.placa, this.numOS);
  }

  openDialog(descServ: string, codServ: string): void {
    this.tempoServicoComponent.openModel(descServ, codServ, this.placa, this.numOS);
  }

  convertTempo(tempoSegundos: number): string {
    const dias = Math.floor(tempoSegundos / 86400);
    const horas = Math.floor((tempoSegundos % 86400) / 3600);
    const minutos = Math.floor((tempoSegundos % 3600) / 60);

    return `${minutos >= 1 ? minutos : "-"}`
  }

  consulta(placa: string, numOS: string) {
    if (placa && numOS) {
      this.dados$.subscribe(dados => {

        const encontrado = dados.find((item: { placa: string; ordemServico: any[]; }) =>
          item.placa === placa && item.ordemServico.some(os => os.numero === numOS)
        );
  
        if (encontrado) {
            const ordemServico = encontrado.ordemServico.find((os: { numero: string; }) => os.numero === numOS);
            if (ordemServico) {
                ordemServico.servicos.forEach((servicos: { codigo_servico: string; descricao: string; tempo_duracao: number}) => {
                    this.codServico.push(servicos.codigo_servico); 
                    this.descServico.push(servicos.descricao);
                    this.tempoServico.push(servicos.tempo_duracao);
                });
            } else {
                alert("Ordem de Serviço não encontrada.");
            }
        } else {
            alert("Serviço não encontrado");
        }
      });
    } else {
      alert("Digite algo");
    }
    
  }
}
