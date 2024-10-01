import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
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
    private service: FormServiceService // injetando o serviço
  ){}
  dados$: Observable<any> = of([]); // Observable que contém os dados retornados pelo serviço, inicializado com um array vazio

   // BehaviorSubjects usados para receber os dados de placa e num da OS de outro componente
  @Input() placa$!: BehaviorSubject<string | undefined>;
  @Input() numOS$!: BehaviorSubject<string | undefined>;
  // arrays para guardar temporariamente os dados das peças associadas a ordem de serviço
  codPeca: string[] = [];
  descPecas: string[] = [];

  ngOnInit() { // inicializando o  compontente
    this.dados$ = this.service.getDados(); // obter os dados
    // Usa combineLatest para combinar os últimos valores de placa$ e numOS$
    combineLatest([this.placa$, this.numOS$]).subscribe(([placa, numOS]) => {
      if (placa && numOS) {
        this.consulta(placa, numOS);
      }
    });
  }

  consulta(placa: string, numOS: string) {
    if (placa && numOS) { // se ambos exixtirem
      this.dados$.subscribe(dados => {
        // procurar o veiculo e a os informada
        const encontrado = dados.find((item: { placa: string; ordemServico: any[]; }) =>
          item.placa === placa && item.ordemServico.some(os => os.numero === numOS)
        );
  
        if (encontrado) {
            const ordemServico = encontrado.ordemServico.find((os: { numero: string; }) => os.numero === numOS);
            this.codPeca = [], this.descPecas = []; // Reinicia os arrays de códigos e descrições das peças
            if (ordemServico) {
                ordemServico.pecas.forEach((peca: { codigo_peca: string; descricao: string; }) => {
                  // se a ordem de serviço for encontrada, preenche os arrays com os dados das peças
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
}