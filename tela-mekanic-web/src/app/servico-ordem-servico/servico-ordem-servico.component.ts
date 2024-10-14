import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormServiceService } from '../form-service/form-service.service';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
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
  isHandset$: Observable<boolean> = of(false);

  constructor(
    private service: FormServiceService
  ){}
  
  dados$: Observable<any> = of([]);
  
  @Input() placa$!: BehaviorSubject<string | undefined>;
  @Input() numOS$!: BehaviorSubject<string | undefined>;

  inPlaca: string = "";
  inNumOS: string = "";

  codServico: string[] = []; //vet para armazenar os serviços da consulta, para depois exibir
  descServico: string[] = []; // ...
  tempoServico: number[] = [];
  valAplicado: boolean[] = [];

  ordenarList(): void {
    const indicesOrdenados = this.tempoServico
    .map((tempo, index) => ({
      tempo,
      aplicado: this.valAplicado[index],
      index
    }))
    // Ordena primeiro pelo estado aplicado e depois pelo tempo
    .sort((a, b) => {
      // Coloca os serviços aplicados por último
      if (a.aplicado !== b.aplicado) {
        return Number(a.aplicado) - Number(b.aplicado);  // aplicado -> último
      }
      // Se ambos têm o mesmo estado aplicado, ordena pelo tempo
      return a.tempo - b.tempo;  // Ordem crescente pelo tempo
    })
    .map(obj => obj.index); // Mapeia para obter apenas os índices
  
    // Reorganiza os arrays com base na ordenação combinada
    this.codServico = indicesOrdenados.map(i => this.codServico[i]);
    this.descServico = indicesOrdenados.map(i => this.descServico[i]);
    this.tempoServico = indicesOrdenados.map(i => this.tempoServico[i]);
    this.valAplicado = indicesOrdenados.map(i => this.valAplicado[i]);
  }
  

  ngOnInit() {
    this.isHandset$ = this.service.isHandset$;
    this.dados$ = this.service.getDados();
    
    combineLatest([this.placa$, this.numOS$]).subscribe(([placa, numOS]) => {
      if (placa && numOS) {
        this.inPlaca = placa;
        this.inNumOS = numOS;
        this.consulta(placa, numOS);
      }
    });
  }

  openDialog(descServ: string, codServ: string): void {
    this.tempoServicoComponent.openModel(descServ, codServ, this.inPlaca, this.inNumOS);
  }

  convertTempo(tempoSegundos: number): string { // converter o tempo para minutos, para exibir na tela
    //const dias = Math.floor(tempoSegundos / 86400);
    //const horas = Math.floor((tempoSegundos % 86400) / 3600);
    const minutos = Math.floor((tempoSegundos) / 60);
    
    return `${minutos >= 1 ? minutos : "-"}` 
  }

  consulta(placa: string, numOS: string) { // melhoria: realizar apenas uma consulta la no Service
    if (placa && numOS) {
      this.dados$.subscribe(dados => {

        const encontrado = dados.find((item: { placa: string; ordemServico: any[]; }) =>
          item.placa === placa && item.ordemServico.some(os => os.numero === numOS)
        );
  
        if (encontrado) {
            const ordemServico = encontrado.ordemServico.find((os: { numero: string; }) => os.numero === numOS);
            if (ordemServico) {
                this.codServico = [], this.descServico = [], this.tempoServico = [], this.valAplicado = [];; // reinicializando os arrays
                ordemServico.servicos.forEach((servicos: { codigo_servico: string; descricao: string; tempo_duracao: number, aplicado: boolean}) => {
                  this.codServico.push(servicos.codigo_servico); 
                  this.descServico.push(servicos.descricao);
                  this.tempoServico.push(servicos.tempo_duracao);
                  this.valAplicado.push(servicos.aplicado)
                });
                this.ordenarList();
            } else {
              console.log("Ordem de Serviço não encontrada.");
            }
        } else {
          console.log("Serviço não encontrado");
        }
      });
    } else {
      console.log("Campos não preenchidos");
    }
  }
}