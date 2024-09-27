import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PecasOrdemServicoComponent } from './pecas-ordem-servico.component';

describe('PecasOrdemServicoComponent', () => {
  let component: PecasOrdemServicoComponent;
  let fixture: ComponentFixture<PecasOrdemServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PecasOrdemServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PecasOrdemServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
