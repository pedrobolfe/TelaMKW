import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempoServicoDialogComponent } from './tempo-servico-dialog.component';

describe('TempoServicoDialogComponent', () => {
  let component: TempoServicoDialogComponent;
  let fixture: ComponentFixture<TempoServicoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempoServicoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempoServicoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
