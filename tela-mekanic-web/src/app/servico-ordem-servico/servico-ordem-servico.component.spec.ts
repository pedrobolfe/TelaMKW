import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoOrdemServicoComponent } from './servico-ordem-servico.component';

describe('ServicoOrdemServicoComponent', () => {
  let component: ServicoOrdemServicoComponent;
  let fixture: ComponentFixture<ServicoOrdemServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicoOrdemServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicoOrdemServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
