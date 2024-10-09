import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FormServiceService } from '../form-service/form-service.service';
import { TempoServicoDialogComponent } from '../tempo-servico-dialog/tempo-servico-dialog.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

// objetivo: obter uma placa e número de uma OS e consultar um serviço e verificar se os dados existem, 
// preencher com os dados correspondentes, e emitir um evento com alguns dados

export class FormComponent {
  form!: FormGroup; // declaração do fomularios, garantindo que não será null ou undefinded
  dados$: Observable<any> = of([]); // um observable para guardar os dados da consulta
  isHandset$: Observable<boolean> = of(false);

  @ViewChild(TempoServicoDialogComponent, {static: true}) tempoServicoComponent!: TempoServicoDialogComponent;
  @Output() formPreenchido = new EventEmitter<{ placa: string; numOS: string}>();
  

  constructor(
    private fb: FormBuilder,
    private service: FormServiceService,
  ){}

  ngOnInit(): void { // inicializando o componente
    this.isHandset$ = this.service.isHandset$; // ajustar de acordo com o tamanho da tela
    this.onRefresh();
    this.form = this.fb.group({ // inicializando o formulario com seus controles e validacoes
      inPlaca: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      numOS: ['', Validators.required],
      outPlaca: [null],
      outMarca: [null],
      outModelo: [null],
      outChassi: [null],
      outCilindrada: [null],
      outAnoModelo: [null],
      mensagem: [null]
    });
  }

  getPopula(): void { // vai chamar outro método para consultar os dados e preencher nos campos
    const placa = this.form.get('inPlaca')?.value.toUpperCase(); // deixar a placa e a OS em maiusculo
    const os = this.form.get('numOS')?.value.toUpperCase();
    this.consulta(placa, os); // funcao para fazer a consulta
  }

  onRefresh() { // atualizar os dados
    this.dados$ = this.service.getDados()
  }

  formatarPlaca(placa:string) { 
    //const p2placa = placa.substring(3);
    return `${placa.substring(0, 3) + "-"+ placa.substring(3)}`;
  }

  consulta(placa: string, numOS: string) {
    if (!this.form.get('inPlaca')?.errors && !this.form.get('numOS')?.errors) { // se placa e os existir e sem erros
      this.dados$.subscribe(dados => {
        placa = placa.replace("-", ""); // remover o '-' da placa

        this.formPreenchido.emit({ placa, numOS }); // emitir um evento com a placa e O.S. para se comunicar com outros componentes
        // erifica se o veiculo com a placa e OS existem
        const encontrado = dados.find((item: { placa: string; ordemServico: any[]; }) => item.placa === placa && item.ordemServico.some(os => os.numero === numOS));
        if (encontrado){ // se existir
          const ordemServico = encontrado.ordemServico.find((os: { numero: string; }) => os.numero === numOS); // localizar o veiculo e a os informada
          if (ordemServico) {
            this.form.patchValue({ // preencher os campos com os dados
              outPlaca: this.formatarPlaca(encontrado.placa),
              outMarca: encontrado.marca,
              outModelo: encontrado.modelo,
              outChassi: encontrado.chassi,
              outCilindrada: encontrado.cilindrada,
              outAnoModelo: encontrado.Ano_anoModelo,
              mensagem: null
            });
           
          }
        } else {
          this.form.patchValue({ // mensagem de erro
            mensagem: "Placa e Ordem de Serviço não encontradas"
          });
        }
    });
    } else {
      console.log("Digite a placa e/ou o número da Ordem de Serviço corretamente");
    }
  }
}