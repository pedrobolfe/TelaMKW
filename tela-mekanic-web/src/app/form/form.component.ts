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

  // enviarDados() {
  //   // passar a placa e num da OS para componente dialog
  //   alert("entrou onSubmit!!")
  //   if (this.tempoServicoComponent){
  //     alert("Entrou set dados!!!")
  //     this.tempoServicoComponent.setDados("ABC-1234", "OS001", "S001");
  //   }
  // }

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
    //this.enviarDados();
  }

  onRefresh() {
    this.dados$ = this.service.getDados()
  }

  consulta(placa: string, numOS: string) {
    this.dados$.subscribe(dados => {
      placa = placa.toUpperCase();
      numOS = numOS.toUpperCase();
      this.formPreenchido.emit({ placa, numOS });

      //alert(placa + "  " + numOS);
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
        }
      } else {
        alert("não encontrado")
        this.form.patchValue({
          outPlaca: null,
          outMarca: null,
          outModelo: null,
          outChassi: null,
          outCilindrada: null,
          outAnoModelo: null,
        });
      }
    });
  }
}
