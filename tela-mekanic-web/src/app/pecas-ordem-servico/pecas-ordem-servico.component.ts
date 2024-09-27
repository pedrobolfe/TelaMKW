import { Component, Input } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { FormServiceService } from '../form-service/form-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pecas-ordem-servico',
  templateUrl: './pecas-ordem-servico.component.html',
  styleUrl: './pecas-ordem-servico.component.css',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class PecasOrdemServicoComponent {
  constructor(
    private service: FormServiceService
  ){}
  
  dados$: Observable<any> = of([]);

  @Input() placa!: string;
  @Input() numOS!: string;
  codPeca: string[] = [];
  descPecas: string[] = [];

  ngOnInit() {
    delay(2000);
    this.dados$ = this.service.getDados();
    
    this.consulta(this.placa, this.numOS);
    
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
                ordemServico.pecas.forEach((peca: { codigo_peca: string; descricao: string; }) => {
                    // Armazena os dados nas variáveis se necessário
                    this.codPeca.push(peca.codigo_peca); // ou criar um array para armazenar
                    this.descPecas.push(peca.descricao); // ou criar um array para armazenar
                });
            } else {
                alert("Ordem de Serviço não encontrada.");
            }
        } else {
            alert("Peça não encontrada");
        }
      });
    } else {
      alert("Digite algo");
    }
  }
}