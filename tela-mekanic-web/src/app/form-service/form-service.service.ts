import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, switchMap } from 'rxjs';
import { Carro } from './Modelo'

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {
  constructor(
    private http: HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:3000/carros';

  getDados(): any {
    return this.http.get<Carro[]>(this.API_URL).pipe();
  }

  updateTempo(placa: string, numOS: string, codServico: string, tempoDuracao: number): Observable<any> {

    const url = `${this.API_URL}?placa=${placa}`; // URL ajustada para buscar pelo carro com a placa
  
    return this.http.get<Carro[]>(url).pipe(
        switchMap(carros => {
            const carro = carros.find(item => item.placa === placa);
            if (carro) {
                const ordemServico = carro.ordemServico.find(os => os.numero === numOS);
                if (ordemServico) {
                    const servico = ordemServico.servicos.find(s => s.codigo_servico === codServico);
                    if (servico) {
                        servico.tempo_duracao += tempoDuracao; // Atualiza o tempo de duração do serviço
                        //alert(this.http.patch(`${this.API_URL}/${carro.id}`, { ordemServico: carro.ordemServico }));
                        // Agora fazemos o PATCH para salvar as alterações
                        return this.http.patch(`${this.API_URL}/${carro.id}`, { ordemServico: carro.ordemServico });
                    } else {
                        throw new Error('Serviço não encontrado.');
                    }
                } else {
                    throw new Error('Ordem de serviço não encontrada.');
                }
            } else {
                throw new Error('Carro não encontrado.');
            }
        })
    );
}
}
