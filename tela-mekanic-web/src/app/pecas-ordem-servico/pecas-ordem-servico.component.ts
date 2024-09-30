import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, delay, Observable, of } from 'rxjs';
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
  subscription: any;
  constructor(
    private service: FormServiceService
  ){}
  dados$: Observable<any> = of([]);

  @Input() placa$!: BehaviorSubject<string | undefined>;
  @Input() numOS$!: BehaviorSubject<string | undefined>;
  codPeca: string[] = [];
  descPecas: string[] = [];

  ngOnInit() {
    delay(2000);
    this.dados$ = this.service.getDados();

    combineLatest([this.placa$, this.numOS$]).subscribe(([placa, numOS]) => {
      if (placa && numOS) {
        this.consulta(placa, numOS);
      }
    });
    //this.consulta(this.placa, this.numOS);
  }

  consulta(placa: string, numOS: string) {
    if (placa && numOS) {
      this.dados$.subscribe(dados => {
        const encontrado = dados.find((item: { placa: string; ordemServico: any[]; }) =>
          item.placa === placa && item.ordemServico.some(os => os.numero === numOS)
        );
  
        if (encontrado) {
            const ordemServico = encontrado.ordemServico.find((os: { numero: string; }) => os.numero === numOS);
            this.codPeca = [], this.descPecas = [];
            if (ordemServico) {
                ordemServico.pecas.forEach((peca: { codigo_peca: string; descricao: string; }) => {
                    this.codPeca.push(peca.codigo_peca); 
                    this.descPecas.push(peca.descricao); 
                });
            } else {
                console.log("Ordem de Serviço não encontrada.");
            }
        } else {
          console.log("Peça não encontrada");
        }
      });
    } else {
      console.log("Campos não preenchidos");
    }
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}