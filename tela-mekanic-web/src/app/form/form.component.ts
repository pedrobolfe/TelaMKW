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
export class FormComponent {
  form!: FormGroup;
  dados$: Observable<any> = of([]);

  @ViewChild(TempoServicoDialogComponent, {static: true}) tempoServicoComponent!: TempoServicoDialogComponent;
  @Output() formPreenchido = new EventEmitter<{ placa: string; numOS: string}>();

  constructor(
    private fb: FormBuilder,
    private service: FormServiceService
  ){}


  ngOnInit(): void {
    this.onRefresh();
    this.form = this.fb.group({
      inPlaca: ['', Validators.required],
      numOS: ['', Validators.required],
      outPlaca: [null],
      outMarca: [null],
      outModelo: [null],
      outChassi: [null],
      outCilindrada: [null],
      outAnoModelo: [null]
    })
  }

  getPopula(): void {
    this.consulta(this.form.get('inPlaca')?.value, this.form.get('numOS')?.value);
  }

  onRefresh() {
    this.dados$ = this.service.getDados()
  }

  consulta(placa: string, numOS: string) {

    if (placa && numOS) {
      this.dados$.subscribe(dados => {
        placa = placa.toUpperCase();
        numOS = numOS.toUpperCase();
        this.formPreenchido.emit({ placa, numOS });
  
        const encontrado = dados.find((item: { placa: string; ordemServico: any[]; }) => item.placa === placa && item.ordemServico.some(os => os.numero === numOS));
        if (encontrado){
          const ordemServico = encontrado.ordemServico.find((os: { numero: string; }) => os.numero === numOS);
          if (ordemServico) {
            this.form.patchValue({
              outPlaca: encontrado.placa,
              outMarca: encontrado.marca,
              outModelo: encontrado.modelo,
              outChassi: encontrado.chassi,
              outCilindrada: encontrado.cilindrada,
              outAnoModelo: encontrado.Ano_anoModelo,
            });
            //this.tempoServicoComponent.guardarTempo()
          }
        } else {
          alert("Placa e Ordem de Serviço não encontrados")
        }
    });
    } else {
      alert("Digite a placa e/ou o número da Ordem de Serviço")
    }
    
  }
}
