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

  constructor(
    private service: FormServiceService
  ){}
  
  dados$: Observable<any> = of([]);
  
  @Input() placa!: string;
  @Input() numOS!: string;
  codServico: string[] = [];
  descServico: string[] = [];

  ngOnInit() {
    delay(2000);
    this.dados$ = this.service.getDados();
    
    this.consulta(this.placa, this.numOS);
    
  }

  openDialog(): void {
    this.tempoServicoComponent.openModel();
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
                // Aqui você pode obter as peças e suas descrições
                ordemServico.servicos.forEach((servicos: { codigo_servico: string; descricao: string; }) => {
                    // Armazena os dados nas variáveis se necessário
                    this.codServico.push(servicos.codigo_servico); // ou criar um array para armazenar
                    this.descServico.push(servicos.descricao); // ou criar um array para armazenar
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
